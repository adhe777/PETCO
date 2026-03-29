import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield, CheckCircle2, PawPrint, HeartPulse, Activity, Sparkles, Eye, EyeOff, ShoppingBag, Globe, Cpu } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const navigate = useNavigate();

    const features = [
        { icon: HeartPulse, title: 'Health Tracking', desc: 'Monitor your pet\'s health and daily wellness with ease.' },
        { icon: Activity, title: 'Smart Insights', desc: 'Get AI-driven health tips and diagnostics for your pets.' },
        { icon: Shield, title: 'Trusted Network', desc: 'Connect with verified vets, surgeons, and specialists.' },
        { icon: Globe, title: 'Community', desc: 'Join a thriving community of thousands of pet owners.' }
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData);
            toast.success(res.data.message || 'Registration successful!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error('Registration API Error:', err);
            const errorMsg = err.response?.data?.error || err.message || 'Registration failed';
            toast.error(errorMsg);
            setIsLoading(false); // Immediate reset on capture
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 aurora-blur bg-midnight overflow-hidden">
            
            {/* --- Decorative Accents --- */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] -z-10 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10 translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl glass-premium flex flex-col lg:flex-row overflow-hidden min-h-[850px] border-white/10"
            >
                
                {/* Left Panel: Simple Brand */}
                <div className="lg:w-[50%] relative flex items-center justify-center p-12 lg:p-20 bg-gradient-to-br from-midnight via-midnight/80 to-emerald-900/10 overflow-hidden">
                    
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_30%,_var(--aurora-emerald)_0%,_transparent_50%)]"></div>
                        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_70%,_var(--aurora-cyan)_0%,_transparent_50%)]"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-lg">
                        <Link to="/" className="inline-flex items-center gap-4 mb-20 group">
                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                className="p-4 bg-emerald-500 rounded-2xl shadow-2xl shadow-emerald-500/20"
                            >
                                <PawPrint className="text-white" size={32} />
                            </motion.div>
                            <span className="text-4xl font-black text-white tracking-tighter">PETCO<span className="text-emerald-500">.</span></span>
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-6xl xl:text-7xl font-black text-white leading-[0.95] tracking-tight mb-8 text-right">
                                Join our<br />
                                <span className="text-gradient">Community.</span>
                            </h1>
                            <p className="text-xl text-muted font-bold leading-relaxed mb-16 max-w-sm ml-auto text-right">
                                Create an account to start your pet care journey.
                            </p>
                        </motion.div>

                        {/* Animated Feature Box */}
                        <div className="relative h-32 ml-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFeature}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="absolute inset-0 bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-row-reverse items-center gap-6 backdrop-blur-3xl"
                                >
                                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
                                        {React.createElement(features[activeFeature].icon, { size: 28 })}
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-lg font-black text-white mb-1 uppercase tracking-wider">{features[activeFeature].title}</h4>
                                        <p className="text-sm text-muted font-bold leading-tight">{features[activeFeature].desc}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-12 flex justify-end gap-3">
                            {features.map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        width: i === activeFeature ? 48 : 12,
                                        backgroundColor: i === activeFeature ? '#10b981' : '#1f2937'
                                    }}
                                    className="h-1.5 rounded-full cursor-pointer transition-all"
                                    onClick={() => setActiveFeature(i)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Clean Form */}
                <div className="lg:w-[50%] bg-midnight-soft/50 flex flex-col justify-center p-10 lg:p-16 relative overflow-y-auto no-scrollbar">
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-md mx-auto py-10"
                    >
                        <h2 className="text-5xl font-black text-white tracking-tight mb-4">Register.</h2>
                        <p className="text-muted font-bold text-lg mb-10">Select your role to get started.</p>

                        <form onSubmit={handleRegister} className="space-y-8">
                            
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2 text-emerald-500">I am a...</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'user', label: 'Pet Parent', icon: User },
                                        { id: 'doctor', label: 'Doctor', icon: Shield }
                                    ].map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: role.id })}
                                            className={`group p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 active:scale-95 ${formData.role === role.id 
                                                ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                                                : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                        >
                                            <div className={`p-2.5 rounded-xl transition-all ${formData.role === role.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-muted group-hover:text-white'}`}>
                                                <role.icon size={18} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${formData.role === role.id ? 'text-emerald-500' : 'text-muted'}`}>
                                                {role.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald-500 transition-colors">
                                            <User size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="glass-input !pl-16 font-bold"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Email</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald-500 transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="glass-input !pl-16 font-bold"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald-500 transition-colors">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="glass-input !pl-16 !pr-16 font-bold"
                                            placeholder="••••••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {formData.role === 'doctor' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-6 pt-2"
                                        >
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 ml-2">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={formData.phone || ''}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="glass-input !px-4"
                                                        placeholder="Phone Number"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 ml-2">Experience (Yrs)</label>
                                                    <input
                                                        type="number"
                                                        value={formData.experience || ''}
                                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                        className="glass-input !px-4"
                                                        placeholder="e.g. 5"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 ml-2">Specialization</label>
                                                    <input
                                                        type="text"
                                                        value={formData.specialization || ''}
                                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                                        className="glass-input !px-4"
                                                        placeholder="e.g. Surgeon"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 ml-2">Qualification</label>
                                                    <input
                                                        type="text"
                                                        value={formData.qualification || ''}
                                                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                                        className="glass-input !px-4"
                                                        placeholder="e.g. DVM"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 ml-2">Clinic Address</label>
                                                <input
                                                    type="text"
                                                    value={formData.clinicAddress || ''}
                                                    onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                                                    className="glass-input !px-4"
                                                    placeholder="Full Address"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 ml-2">License Number</label>
                                                <div className="relative group">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald-500 transition-colors">
                                                        <Shield size={20} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={formData.licenseNumber || ''}
                                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                                        className="glass-input !pl-16"
                                                        placeholder="VET-XXXXX (Mandatory)"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full !py-6 !text-sm flex items-center justify-center gap-4 group"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Sign Up
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                            <p className="text-muted font-bold text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-emerald-500 hover:text-white transition-colors underline underline-offset-8 decoration-2 decoration-emerald-500/30">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
