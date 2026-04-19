import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Calendar, Activity, ArrowRight, LogOut, Settings, ShieldCheck, Sparkles, Bell, CreditCard, ShoppingBag, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DoctorDashboard from '../components/DoctorDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';

const PatientDashboard = ({ user, latestAppointment, navItems, orders, handleLogout, getStatusStyle, handleCancelOrder }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-12 pb-20"
        >
            <div className="glass-premium border-white/5 p-10 lg:p-16 rounded-[4rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                    <User size={300} className="text-emerald-500" />
                </div>
                
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>

                <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 relative z-10">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[3rem] bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center text-6xl font-black text-white">
                            {user.name?.[0] || 'U'}
                        </div>
                        <div className="absolute -bottom-2 -right-2 p-3 rounded-2xl glass-premium border-white/10 bg-emerald-500 text-white shadow-xl">
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    <div className="text-center lg:text-left flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                            <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">{user.name || 'Pet Parent'}</h1>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] w-fit mx-auto lg:mx-0">
                                <Sparkles size={12} />
                                {user.role || 'Member'}
                            </div>
                        </div>
                        <p className="text-xl text-muted font-bold mb-8">{user.email}</p>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="px-6 py-3 rounded-2xl glass-premium border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <MapPin size={14} className="text-emerald-500" /> {user.savedAddress || 'Address Not Set'}
                            </div>
                            <div className="px-6 py-3 rounded-2xl glass-premium border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <Phone size={14} className="text-cyan-500" /> {user.phone || 'Contact Not Set'}
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {latestAppointment && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-16 p-8 rounded-[2.5rem] glass-premium border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-emerald-500/30 transition-all group"
                        >
                            <div className="flex items-center gap-8">
                                <div className="p-5 bg-emerald-500/10 rounded-3xl text-emerald-500 shadow-xl shadow-emerald-500/5 group-hover:scale-110 transition-transform">
                                    <Activity size={32} />
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-[10px] text-muted font-black uppercase tracking-[0.4em] mb-2">Upcoming Appointment</h3>
                                    <p className="text-2xl font-black text-white tracking-tight">
                                        {`Dr. ${latestAppointment.doctorId?.name || 'Assigned Vet'}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border text-center ${getStatusStyle(latestAppointment.status)}`}>
                                    {latestAppointment.status}
                                </div>
                                <Link to="/appointments" className="p-5 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                                    <ArrowRight size={24} />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 relative z-10">
                    {navItems.map((item, i) => (
                        <Link
                            to={item.active ? item.path : '#'}
                            onClick={(e) => {
                                if (!item.active) {
                                    e.preventDefault();
                                    toast('Coming soon...', { icon: '🚧' });
                                }
                            }}
                            key={i}
                            className="p-8 rounded-[2.5rem] glass-premium border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="p-4 bg-emerald-500/5 rounded-2xl w-fit mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all text-emerald-400">
                                <item.icon size={22} />
                            </div>
                            <h3 className="font-black text-white text-lg mb-2 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{item.label}</h3>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-3 px-6 py-3 rounded-xl glass-premium border-white/5 text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-all">
                            <Settings size={14} /> Security
                        </button>
                        <button className="flex items-center gap-3 px-6 py-3 rounded-xl glass-premium border-white/5 text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-all">
                            <CreditCard size={14} /> Payments
                        </button>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl glass-premium border-white/5 text-red-500/60 font-black uppercase tracking-[0.2em] text-[10px] hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user') || '{}'));
    const [latestAppointment, setLatestAppointment] = useState(null);
    const [orders, setOrders] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) return;

                const [appRes, orderRes, userRes] = await Promise.all([
                    axios.get(`${API_URL}/api/appointments/my`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}/api/orders/user/${user.id || user._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (appRes.data && appRes.data.length > 0) {
                    setLatestAppointment(appRes.data[0]);
                }
                setOrders(orderRes.data);
                if (userRes.data) {
                    setUser(userRes.data);
                }
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setFetching(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleCancelOrder = async (orderId, reason) => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.patch(`${API_URL}/api/orders/${orderId}/cancel`, { reason }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Order cancelled successfully");
            setOrders(orders.map(o => o._id === orderId ? res.data : o));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to cancel order");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const navItems = [
        { icon: Package, label: 'My Orders', desc: 'View your order history', path: '/orders', active: true },
        { icon: Calendar, label: 'My Appointments', desc: 'Manage your consultations', path: '/appointments', active: true },
        { icon: Bell, label: 'Notifications', desc: 'Stay updated', path: '#', active: false },
    ];

    const isDoctor = user.role === 'Veterinarian' || user.role === 'doctor';
    const isAdmin = user.role === 'admin' || user.role === 'Administrator';

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'confirmed': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-muted bg-white/5 border-white/5';
        }
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-midnight transition-colors duration-300 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-6">
                {isDoctor ? (
                    <DoctorDashboard user={user} handleLogout={handleLogout} />
                ) : isAdmin ? (
                    <AdminDashboard />
                ) : (
                    <PatientDashboard
                        user={user}
                        latestAppointment={latestAppointment}
                        navItems={navItems}
                        orders={orders}
                        handleLogout={handleLogout}
                        getStatusStyle={getStatusStyle}
                        handleCancelOrder={handleCancelOrder}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;
