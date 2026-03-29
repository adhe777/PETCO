import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, User, ShoppingCart, Search, Menu, X, Sun, Moon, ArrowRight, Calendar, Bell, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const { cartCount } = useCart();

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const isDoctor = user.role === 'Veterinarian' || user.role === 'doctor';

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Marketplace', path: '/marketplace' },
        ...(!isDoctor && user.role !== 'admin' && user.role !== 'Administrator' ? [
            { name: 'Appointments', path: '/doctor' },
            { name: 'Smart Care', path: '/ai-diag' },
        ] : []),
        ...(isDoctor ? [
            { name: 'Dashboard', path: '/doctor-dashboard' },
        ] : []),
        ...(user.role === 'admin' || user.role === 'Administrator' ? [
            { name: 'Dashboard', path: '/admin-dashboard' },
        ] : []),
    ];

    const location = useLocation();

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
            <div className="container-premium">
                <nav className={`transition-all duration-500 p-2 ${isScrolled ? 'glass-premium px-6 py-3' : 'bg-transparent px-4'}`}>
                    <div className="flex items-center justify-between">
                        
                        {/* --- Logo --- */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className="p-2.5 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-[1rem] shadow-lg shadow-emerald-500/20"
                            >
                                <PawPrint className="text-white" size={24} />
                            </motion.div>
                            <span className="text-2xl font-black text-gradient tracking-tighter">PETCO</span>
                        </Link>

                        {/* --- Desktop Nav --- */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path} 
                                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-0.5 ${
                                        location.pathname === link.path ? 'text-emerald-500' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* --- Action Controls --- */}
                        <div className="flex items-center gap-2 md:gap-4">
                            
                            {/* Theme & Search */}
                            <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/5">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2.5 rounded-xl hover:bg-white/10 text-muted hover:text-white transition-all active:scale-90"
                                >
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2.5 rounded-xl hover:bg-white/10 text-muted hover:text-white transition-all active:scale-90"
                                >
                                    <Search size={18} />
                                </button>
                            </div>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative p-3 bg-white/5 border border-white/10 rounded-2xl text-muted hover:text-emerald-500 transition-all hover:scale-105 active:scale-95 shadow-sm group"
                            >
                                <ShoppingCart size={20} />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[var(--midnight)] shadow-md group-hover:animate-bounce">
                                    {cartCount}
                                </span>
                            </Link>

                            {/* Auth / Profile */}
                            {sessionStorage.getItem('user') ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/profile"
                                        className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all hover:scale-105 shadow-inner ${
                                            location.pathname === '/profile' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 border-white/10 text-emerald-500 hover:border-emerald-500/40'
                                        }`}
                                    >
                                        <User size={20} />
                                    </Link>
                                    <button
                                        onClick={() => { sessionStorage.clear(); window.location.href = '/login'; }}
                                        className="w-11 h-11 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all hover:scale-105 active:scale-95"
                                        title="Logout"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="btn-gradient !py-3 !px-6 hidden sm:flex items-center gap-2"
                                >
                                    <User size={16} />
                                    <span className="text-[10px] uppercase tracking-widest">Access</span>
                                </Link>
                            )}

                            {/* Mobile Toggle */}
                            <button
                                className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-2xl text-white active:scale-90 transition-all"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden absolute top-full left-0 w-full glass-premium mt-2 border-x-0 border-b rounded-none overflow-hidden"
                    >
                        <div className="flex flex-col p-8 gap-6 text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-2xl font-black text-white hover:text-emerald-500 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-white/10 w-full"></div>
                            <div className="flex justify-center gap-6">
                                <Link to="/cart" className="p-4 bg-white/5 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
                                    <ShoppingCart size={24} className="text-muted" />
                                </Link>
                                <Link to="/profile" className="p-4 bg-white/5 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
                                    <User size={24} className="text-muted" />
                                </Link>
                            </div>
                            {!sessionStorage.getItem('user') && (
                                <Link to="/login" className="btn-gradient py-5 text-center" onClick={() => setIsMenuOpen(false)}>
                                    Initial Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Overlay Re-themed */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-midnight/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-6 aurora-blur"
                    >
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute top-10 right-10 text-muted hover:text-white p-2 transition-all hover:rotate-90"
                        >
                            <X size={40} />
                        </button>
                        <div className="w-full max-w-2xl text-center">
                            <motion.h2 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-5xl font-black text-white mb-10 tracking-tight"
                            >
                                What are we <span className="text-gradient">tracking?</span>
                            </motion.h2>
                            <div className="relative group">
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search breeds, surgeons, or goods..."
                                    className="glass-input !py-8 !px-10 !text-2xl text-center"
                                />
                                <div className="mt-10 flex justify-center gap-4 text-xs font-black text-muted uppercase tracking-widest">
                                    <span>Trending:</span>
                                    <span className="text-emerald-500 cursor-pointer">Pitbull Diet</span>
                                    <span className="text-cyan-500 cursor-pointer">Fracture Expert</span>
                                    <span className="text-violet-500 cursor-pointer">Premium Kibble</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
