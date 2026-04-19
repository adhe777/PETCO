import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, User, ClipboardList, Wallet, Activity,
    TrendingUp, Users, CheckCircle, AlertCircle, ArrowRight,
    Search, Filter, ChevronRight, MessageSquare, MoreVertical,
    Star, Shield, X, Save, Check, Ban, FileText, Pill, Sparkles, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const ManageModal = ({ appointment, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        status: appointment.status,
        diagnosis: appointment.diagnosis || '',
        prescription: appointment.prescription || '',
        notes: appointment.notes || '',
        recommendedProducts: appointment.recommendedProducts || []
    });
    const [saving, setSaving] = useState(false);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/products`);
                setAvailableProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products');
            }
        };
        fetchProducts();
    }, []);
    
    const toggleProduct = (productId) => {
        setFormData(prev => {
            const isSelected = prev.recommendedProducts.includes(productId);
            if (isSelected) {
                return { ...prev, recommendedProducts: prev.recommendedProducts.filter(id => id !== productId) };
            } else {
                return { ...prev, recommendedProducts: [...prev.recommendedProducts, productId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = sessionStorage.getItem('token');
            await axios.patch(`${API_URL}/api/appointments/update/${appointment._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Patient records updated');
            onUpdate();
            onClose();
        } catch (err) {
            console.error('Update failed:', err);
            toast.error('Failed to update patient records');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-midnight/80 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                className="glass-premium border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl"
            >
                <div className="bg-emerald-600 p-10 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">Manage Appointment</h2>
                        <p className="text-emerald-100/70 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Patient: {appointment.userId?.name}</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-95"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted ml-1">Appointment Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="glass-input !py-4 !px-6 text-sm font-black uppercase tracking-widest appearance-none cursor-pointer"
                            >
                                <option value="Pending">Pending Review</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted ml-1">Appointment Time</label>
                            <div className="glass-premium border-white/5 p-4 rounded-2xl text-white font-black flex items-center gap-3 text-sm">
                                <Clock size={16} className="text-emerald-500" />
                                {appointment.time}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted ml-1 flex items-center gap-2">
                            <Activity size={12} className="text-emerald-500" /> Diagnosis
                        </label>
                        <textarea
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                            placeholder="Enter diagnosis details..."
                            className="glass-input !py-5 !px-6 text-base h-32"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted ml-1 flex items-center gap-2">
                            <Pill size={12} className="text-cyan-500" /> Prescription
                        </label>
                        <textarea
                            value={formData.prescription}
                            onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                            placeholder="Medicine, dosage, and instructions..."
                            className="glass-input !py-5 !px-6 text-base h-32"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted ml-1 flex items-center gap-2">
                            <Sparkles size={12} className="text-cyan-500" /> Recommend Products
                        </label>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="glass-input !py-3 !px-4 text-xs mb-2 bg-white/5 placeholder-white/20 text-white w-full rounded-2xl outline-none focus:border-emerald-500/50 transition-all border border-transparent"
                        />
                        <div className="glass-input !p-4 max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                            {availableProducts
                                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(p => (
                                <label key={p._id} className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors border ${formData.recommendedProducts.includes(p._id) ? 'bg-emerald-500/10 border-emerald-500/30' : 'hover:bg-white/5 border-transparent'}`}>
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${formData.recommendedProducts.includes(p._id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-emerald-500/30'}`}>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={formData.recommendedProducts.includes(p._id)}
                                            onChange={() => toggleProduct(p._id)} 
                                        />
                                        {formData.recommendedProducts.includes(p._id) && <Check size={14} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-white">{p.name}</span>
                                        <span className="text-[10px] text-emerald-400 font-bold">₹{p.price}</span>
                                    </div>
                                </label>
                            ))}
                            {availableProducts.length === 0 && <p className="text-xs text-muted">No products available to recommend.</p>}
                        </div>
                    </div>

                    <div className="pt-6 flex gap-6">
                        <button
                            type="button" onClick={onClose}
                            className="flex-1 py-5 glass-premium border-white/10 text-muted rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-all active:scale-95"
                        >
                            Discard
                        </button>
                        <button
                            type="submit" disabled={saving}
                            className="bg-emerald-500 text-white flex-[2] !py-5 !text-[10px] !font-black !uppercase !tracking-[0.3em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 rounded-2xl"
                        >
                            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                            {saving ? 'Saving...' : 'Save Records'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const DoctorDashboard = ({ user, handleLogout }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApt, setSelectedApt] = useState(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const res = await axios.get(`${API_URL}/api/appointments/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const stats = [
        { label: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length || '0', icon: Users, color: 'emerald', trend: 'Active' },
        { label: 'Pending', value: appointments.filter(a => a.status === 'Pending').length || '0', icon: ClipboardList, color: 'cyan', trend: 'Action Req' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'Completed').length || '0', icon: Activity, color: 'blue', trend: 'Done' },
        { label: 'Total', value: appointments.length || '0', icon: Calendar, color: 'emerald', trend: 'All Time' },
    ];

    const tabs = [
        { id: 'Overview', icon: LayoutDashboard },
        { id: 'Appointments', icon: Calendar },
        { id: 'Reports', icon: ClipboardList },
    ];

    const pastAppointments = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');
    const activeAppointments = appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed');

    return (
        <div className="flex flex-col lg:flex-row min-h-[90vh] bg-midnight pt-20">
            {/* Sidebar */}
            <div className="w-full lg:w-72 glass-premium border-r border-white/5 p-6 space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl whitespace-nowrap lg:whitespace-normal font-black text-[10px] uppercase tracking-[0.3em] transition-all flex-shrink-0 ${
                            activeTab === tab.id 
                            ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                            : 'text-muted hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.id}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 lg:p-12 space-y-12 h-screen overflow-y-auto custom-scrollbar">
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-premium border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                            <Shield size={12} /> Verified Doctor
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight flex items-center gap-4 mb-4">
                            Doctor <span className="text-emerald-500">Dashboard.</span>
                        </h1>
                        <p className="text-xl text-muted font-bold">Welcome back, Dr. {user.name?.split(' ')[1] || user.name}.</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* OVERVIEW TAB */}
                        {activeTab === 'Overview' && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="glass-premium border-white/5 p-8 rounded-[2.5rem] shadow-2xl hover:border-emerald-500/30 transition-all group overflow-hidden relative">
                                            <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform`}>
                                                    <stat.icon size={24} />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-400">
                                                    {stat.trend}
                                                </span>
                                            </div>
                                            <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</h3>
                                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="glass-premium border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6">Today's Focus</h3>
                                    <p className="text-muted font-bold">You have {activeAppointments.length} upcoming/pending appointments requiring attention.</p>
                                    <button onClick={() => setActiveTab('Appointments')} className="mt-6 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                                        View Appointments
                                    </button>
                                </div>
                            </>
                        )}

                        {/* APPOINTMENTS TAB */}
                        {activeTab === 'Appointments' && (
                            <div className="glass-premium border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <div className="p-8 border-b border-white/5">
                                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                        <Activity className="text-emerald-500" size={24} /> Active Appointments
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-white/[0.02] border-b border-white/5">
                                                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">Patient</th>
                                                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">Status</th>
                                                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">Time</th>
                                                <th className="px-10 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-muted">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {loading ? (
                                                <tr><td colSpan="5" className="p-20 text-center text-muted uppercase text-[10px] font-black tracking-[0.5em]">Loading...</td></tr>
                                            ) : activeAppointments.length === 0 ? (
                                                <tr><td colSpan="5" className="p-20 text-center text-muted text-[10px] tracking-[0.4em]">No active appointments.</td></tr>
                                            ) : (
                                                activeAppointments.map((apt) => (
                                                    <tr key={apt._id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-10 py-6">
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white flex items-center justify-center font-black">
                                                                    {apt.userId?.name?.charAt(0) || 'P'}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black text-white tracking-tight mb-1">{apt.userId?.name || 'Unknown Patient'}</p>
                                                                    <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">{apt.petName || 'Pet'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-2xl ${
                                                                apt.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                            }`}>
                                                                {apt.status}
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-6 text-[10px] text-muted font-black tracking-widest">
                                                            {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                                        </td>
                                                        <td className="px-10 py-6 text-right">
                                                            <button
                                                                onClick={() => setSelectedApt(apt)}
                                                                className="px-6 py-2 glass-premium border-white/5 hover:border-emerald-500/50 text-emerald-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                                                            >
                                                                ACTIONS
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* REPORTS TAB */}
                        {activeTab === 'Reports' && (
                            <div className="glass-premium border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                        <ClipboardList className="text-emerald-500" size={24} /> Past Consultations
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-white/[0.02] border-b border-white/5">
                                                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">Patient</th>
                                                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">Diagnosis</th>
                                                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {loading ? (
                                                <tr><td colSpan="3" className="p-20 text-center text-muted uppercase text-[10px] font-black tracking-[0.5em]">Loading...</td></tr>
                                            ) : pastAppointments.length === 0 ? (
                                                <tr><td colSpan="3" className="p-20 text-center text-muted text-[10px] tracking-[0.4em]">No past consultations found.</td></tr>
                                            ) : (
                                                pastAppointments.map((apt) => (
                                                    <tr key={apt._id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-10 py-6 font-black text-white text-sm">
                                                            {apt.userId?.name || 'Unknown Patient'}
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <p className="text-xs text-emerald-100/70 line-clamp-2">{apt.diagnosis || 'No diagnosis recorded'}</p>
                                                        </td>
                                                        <td className="px-10 py-6 text-[10px] text-muted font-black tracking-widest">
                                                            {new Date(apt.date).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {selectedApt && (
                    <ManageModal
                        appointment={selectedApt}
                        onClose={() => setSelectedApt(null)}
                        onUpdate={fetchAppointments}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Add LayoutDashboard to imports at the top
export default DoctorDashboard;
