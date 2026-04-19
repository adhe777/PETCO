import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, PawPrint, ShieldCheck, Zap, Eye, EyeOff, Sparkles, HeartPulse, Globe, Fingerprint } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        { icon: ShieldCheck, title: 'Verified Doctors', desc: 'All medical professionals are thoroughly vetted and certified.' },
        { icon: Zap, title: 'Smart Diagnostics', desc: 'Advanced health insights for your pets using modern technology.' },
        { icon: Fingerprint, title: 'Secure Data', desc: 'Your medical records and personal info are safe with us.' },
        { icon: Globe, title: 'Wide Network', desc: 'Connect with pet care experts and services in your area.' }
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success('Welcome back!');
            setTimeout(() => {
                const r = res.data.user.role;
                if (r === 'doctor' || r === 'Veterinarian') {
                    window.location.href = '/doctor-dashboard';
                } else if (r === 'admin' || r === 'Administrator') {
                    window.location.href = '/admin-dashboard';
                } else {
                    window.location.href = '/';
                }
            }, 800);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 aurora-blur bg-midnight overflow-hidden">
            
            {/* --- Decorative Elements --- */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl glass-premium flex flex-col lg:flex-row overflow-hidden min-h-[750px] border-white/10"
            >
                
                {/* Left Panel: Simple Brand */}
                <div className="lg:w-[55%] relative flex items-center justify-center p-12 lg:p-20 bg-gradient-to-br from-midnight via-midnight/80 to-emerald-900/10 overflow-hidden">
                    
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_var(--aurora-emerald)_0%,_transparent_50%)]"></div>
                        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,_var(--aurora-cyan)_0%,_transparent_50%)]"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-lg">
                        <Link to="/" className="inline-flex items-center gap-4 mb-24 group">
                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                className="p-4 bg-emerald-500 rounded-2xl shadow-2xl shadow-emerald-500/20"
                            >
                                <PawPrint className="text-white" size={32} />
                            </motion.div>
                            <span className="text-4xl font-black text-white tracking-tighter">PETCO<span className="text-emerald-500">.</span></span>
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-6xl xl:text-7xl font-black text-white leading-[0.95] tracking-tight mb-8">
                                Welcome<br />
                                <span className="text-gradient">Back.</span>
                            </h1>
                            <p className="text-xl text-muted font-bold leading-relaxed mb-16 max-w-sm">
                                Access the world's most advanced pet health platform.
                            </p>
                        </motion.div>

                        {/* Animated Feature Box */}
                        <div className="relative h-32">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFeature}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="absolute inset-0 bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-6 backdrop-blur-3xl"
                                >
                                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
                                        {React.createElement(features[activeFeature].icon, { size: 28 })}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white mb-1 uppercase tracking-wider">{features[activeFeature].title}</h4>
                                        <p className="text-sm text-muted font-bold leading-tight">{features[activeFeature].desc}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-12 flex gap-3">
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
                <div className="lg:w-[45%] bg-midnight-soft/50 flex flex-col justify-center p-12 lg:p-20 relative">
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-md mx-auto"
                    >
                        <h2 className="text-5xl font-black text-white tracking-tight mb-4">Login.</h2>
                        <p className="text-muted font-bold text-lg mb-12">Enter your details to sign in.</p>

                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Email</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald-500 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="glass-input !pl-16 text-lg"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Password</label>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald-500 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="glass-input !pl-16 !pr-16 text-lg"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-all"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full !py-6 !text-sm flex items-center justify-center gap-4"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                            <p className="text-muted font-bold text-sm">
                                No account?{' '}
                                <Link to="/register" className="text-emerald-500 hover:text-white transition-colors underline underline-offset-8 decoration-2 decoration-emerald-500/30">
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
