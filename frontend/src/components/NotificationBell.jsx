import React, { useState, useEffect, useRef } from 'react';
import { Bell, Package, Calendar, Stethoscope, CheckCheck, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const fetchNotifications = async () => {
        if (!user?.id) return;
        try {
            const res = await axios.get(`${API_URL}/api/notifications/${user.id}`);
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch {
            // Silent fail
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = async () => {
        try {
            await axios.patch(`${API_URL}/api/notifications/read-all/${user.id}`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch {}
    };

    const markRead = async (id) => {
        try {
            await axios.patch(`${API_URL}/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {}
    };

    const deleteNotification = async (e, id) => {
        e.stopPropagation();
        try {
            await axios.delete(`${API_URL}/api/notifications/${id}`);
            setNotifications(prev => {
                const filtered = prev.filter(n => n._id !== id);
                return filtered;
            });
            // Fetch updated count to ensure sync
            fetchNotifications();
            toast.success('Notification removed', { id: 'notif-delete' });
        } catch (err) {
            toast.error('Failed to delete notification');
        }
    };

    const clearAll = async () => {
        try {
            await axios.delete(`${API_URL}/api/notifications/all/${user.id}`);
            setNotifications([]);
            setUnreadCount(0);
            toast.success('Notifications cleared');
        } catch (err) {
            toast.error('Failed to clear notifications');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <Package size={14} className="text-emerald-400" />;
            case 'appointment': return <Calendar size={14} className="text-cyan-400" />;
            case 'doctor': return <Stethoscope size={14} className="text-violet-400" />;
            default: return <Bell size={14} className="text-gray-400" />;
        }
    };

    const getTypeBg = (type) => {
        switch (type) {
            case 'order': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'appointment': return 'bg-cyan-500/10 border-cyan-500/20';
            case 'doctor': return 'bg-violet-500/10 border-violet-500/20';
            default: return 'bg-white/5 border-white/10';
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (!user?.id) return null;

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 bg-white/5 border border-white/10 rounded-2xl text-muted hover:text-white hover:border-white/20 transition-all hover:scale-105 active:scale-95"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[var(--midnight)] shadow-lg animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-14 w-80 md:w-96 glass-premium border-white/10 rounded-3xl overflow-hidden shadow-2xl z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <Bell size={16} className="text-emerald-400" />
                                <span className="text-sm font-black text-white uppercase tracking-widest">Notifications</span>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-black rounded-full uppercase tracking-widest">
                                        {unreadCount} New
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors"
                                    >
                                        <CheckCheck size={12} />
                                        All Read
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="flex items-center gap-1.5 text-[10px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors"
                                    >
                                        <Trash2 size={12} />
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notification list */}
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                                        <Bell size={20} className="text-muted" />
                                    </div>
                                    <p className="text-sm font-black text-white mb-1">All caught up!</p>
                                    <p className="text-xs text-muted">No notifications yet.</p>
                                </div>
                            ) : (
                                <div className="p-3 space-y-2">
                                    {notifications.map((notif) => (
                                        <motion.div
                                            key={notif._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`relative p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${!notif.isRead ? 'bg-white/5 border-white/10' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'}`}
                                            onClick={() => markRead(notif._id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-xl border mt-0.5 ${getTypeBg(notif.type)}`}>
                                                    {getIcon(notif.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-black text-white leading-tight mb-1">{notif.title}</p>
                                                    <p className="text-[11px] text-muted leading-relaxed">{notif.message}</p>
                                                    <p className="text-[9px] font-black text-muted/50 uppercase tracking-widest mt-2">{timeAgo(notif.createdAt)}</p>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    {!notif.isRead && (
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                    )}
                                                    <button
                                                        onClick={(e) => deleteNotification(e, notif._id)}
                                                        className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
