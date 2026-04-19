import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Stethoscope, FileText, Pill, AlertCircle, Sparkles, ChevronRight, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { API_URL } from '../config';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const res = await axios.get(`${API_URL}/api/appointments/my`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setAppointments(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError(err.response?.data?.message || 'Failed to load appointments. Please check your connection.');
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5';
            case 'confirmed':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5';
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5';
            case 'cancelled':
                return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5';
            default:
                return 'bg-white/10 text-muted border-white/10';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-midnight flex flex-col justify-center items-center">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] shimmer">Loading Appointments...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-midnight transition-colors duration-300 overflow-hidden">
            
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl">
                
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-20 gap-12">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-premium border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 Shimmer">
                            <Sparkles size={12} />
                            Medical Appointments
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[0.9]">
                            My <br />
                            <span className="text-gradient">Appointments.</span>
                        </h1>
                        <p className="text-xl text-muted font-bold max-w-2xl leading-relaxed">
                            Manage your medical appointments, diagnostic reports, and health checkup schedules.
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {appointments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-premium border-white/5 rounded-[3rem] p-20 text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-emerald-500/[0.02] -z-10"></div>
                            <Calendar className="w-24 h-24 text-white/5 mx-auto mb-10" />
                            <h3 className="text-4xl font-black text-white mb-6 tracking-tight">No Appointments Found.</h3>
                            <p className="text-xl text-muted font-bold mb-12 max-w-md mx-auto">
                                You haven't scheduled any medical consultations yet.
                            </p>
                            <Link to="/doctor" className="btn-gradient !px-12 !py-6 !text-[10px] !font-black inline-flex items-center gap-4 group shadow-emerald-500/20 Shimmer">
                                BOOK APPOINTMENT <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {appointments.map((apt, index) => (
                                <motion.div
                                    key={apt._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-premium border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col shadow-2xl"
                                >
                                    <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-xl ${getStatusStyle(apt.status)}`}>
                                                {apt.status}
                                            </div>
                                            <div className="p-2 rounded-xl glass-premium border-white/5 text-muted">
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                                {apt.doctorId?.name?.charAt(0) || 'D'}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">
                                                    {apt.doctorId?.name || 'Veterinarian'}
                                                </h3>
                                                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-400 gap-2">
                                                    <Stethoscope size={14} />
                                                    {apt.doctorId?.specialization || 'Clinical Staff'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-8 flex-grow">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-3 p-5 rounded-2xl glass-premium border-white/5 group/node hover:border-emerald-500/20 transition-all">
                                                <div className="flex items-center gap-2 text-muted text-[9px] font-black uppercase tracking-[0.3em]">
                                                    <Calendar size={14} className="group-hover/node:text-emerald-500 transition-colors" /> Date
                                                </div>
                                                <span className="text-white font-black text-sm">
                                                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-3 p-5 rounded-2xl glass-premium border-white/5 group/node hover:border-cyan-500/20 transition-all">
                                                <div className="flex items-center gap-2 text-muted text-[9px] font-black uppercase tracking-[0.3em]">
                                                    <Clock size={14} className="group-hover/node:text-cyan-500 transition-colors" /> Time
                                                </div>
                                                <span className="text-white font-black text-sm">
                                                    {apt.time || 'TBD'}
                                                </span>
                                            </div>
                                        </div>

                                        {(apt.diagnosis || apt.prescription) && (
                                            <div className="space-y-6 pt-6 border-t border-white/5">
                                                {apt.diagnosis && (
                                                    <div className="group/diag">
                                                        <div className="flex items-center gap-2 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-3">
                                                            <FileText size={14} /> Diagnosis
                                                        </div>
                                                        <p className="text-sm font-bold text-muted leading-relaxed glass-premium p-5 rounded-2xl border-white/5 group-hover/diag:border-blue-500/20 transition-all">
                                                            {apt.diagnosis}
                                                        </p>
                                                    </div>
                                                )}

                                                {apt.prescription && (
                                                    <div className="group/pill">
                                                        <div className="flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] mb-3">
                                                            <Pill size={14} /> Prescription
                                                        </div>
                                                        <p className="text-sm font-bold text-muted leading-relaxed glass-premium p-5 rounded-2xl border-white/5 group-hover/pill:border-emerald-500/20 transition-all">
                                                            {apt.prescription}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {apt.recommendedProducts && apt.recommendedProducts.length > 0 && (
                                            <div className="space-y-4 pt-6 border-t border-white/5 mx-8 mb-8 pb-4">
                                                <div className="flex items-center gap-2 text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">
                                                    <Sparkles size={14} /> Recommended Products
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {apt.recommendedProducts.map((prod) => (
                                                        <div key={prod._id} className="glass-premium border-white/5 p-4 rounded-xl flex items-center justify-between group/prod hover:border-emerald-500/30 transition-all">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-white">{prod.name}</span>
                                                                <span className="text-[10px] text-emerald-400 font-bold">₹{prod.price}</span>
                                                            </div>
                                                            <button 
                                                                onClick={() => addToCart(prod, 1)}
                                                                className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all shadow-xl shadow-emerald-500/5 active:scale-95"
                                                                title="Add to Cart"
                                                            >
                                                                <ShoppingCart size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                    </div>

                                    {apt.status === 'Pending' && (
                                        <div className="p-8 pt-0">
                                            <button className="w-full py-4 rounded-2xl glass-premium border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60 hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95">
                                                Cancel Appointment
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="px-8 pb-8 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck size={14} className="text-emerald-500/40" />
                                            <span className="text-[8px] font-black text-muted uppercase tracking-[0.5em] opacity-30">Secure Clinical Node v4.0</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MyAppointments;
