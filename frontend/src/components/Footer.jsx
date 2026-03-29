import React from 'react';
import { PawPrint, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ShieldCheck, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Footer = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const isDoctor = user.role === 'Veterinarian' || user.role === 'doctor';

    return (
        <footer className="bg-midnight-soft border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>

            <div className="container-premium mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    
                    {/* --- Brand Block --- */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl shadow-lg shadow-emerald-500/20">
                                <PawPrint className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-black text-gradient tracking-tighter">PETCO</span>
                        </Link>
                        <p className="text-muted text-sm leading-relaxed max-w-xs font-medium">
                            The next generation of pet care. Leveraging AI and a verified marketplace to establish the world's most intelligent companion ecosystem.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                                <a 
                                    key={i} 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); toast.success('Link coming soon!'); }} 
                                    className="p-3 bg-white/5 rounded-2xl text-muted hover:text-emerald-500 hover:bg-white/10 transition-all border border-white/5 hover:scale-110 active:scale-90"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* --- Core Navigation --- */}
                    <div>
                        <h4 className="text-white text-xs font-black uppercase tracking-[0.25em] mb-8">Navigation</h4>
                        <ul className="space-y-5 text-sm text-muted font-bold">
                            <li><Link to="/" className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 scale-0 group-hover:scale-100 transition-transform"></div> Home</Link></li>
                            <li><Link to="/marketplace" className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 scale-0 group-hover:scale-100 transition-transform"></div> Marketplace</Link></li>
                            {!isDoctor && (
                                <>
                                    <li><Link to="/doctor" className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 scale-0 group-hover:scale-100 transition-transform"></div> Consultations</Link></li>
                                    <li><Link to="/ai-diag" className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 scale-0 group-hover:scale-100 transition-transform"></div> Neural Scan</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* --- Intelligent Features --- */}
                    <div>
                        <h4 className="text-white text-xs font-black uppercase tracking-[0.25em] mb-8">Ecosystem</h4>
                        <ul className="space-y-5 text-sm text-muted font-bold">
                            <li className="flex items-center gap-3 cursor-help text-muted hover:text-white transition-colors"><Cpu size={14} className="text-emerald-500" /> AI Symptom Matrix</li>
                            <li className="flex items-center gap-3 cursor-help text-muted hover:text-white transition-colors"><ShieldCheck size={14} className="text-emerald-500" /> Verified Surgeons</li>
                            <li className="flex items-center gap-3 cursor-help text-muted hover:text-white transition-colors"><ShieldCheck size={14} className="text-emerald-500" /> Smart Marketplace</li>
                        </ul>
                    </div>

                    {/* --- Contact / Location --- */}
                    <div className="space-y-8">
                        <h4 className="text-white text-xs font-black uppercase tracking-[0.25em] mb-8">HQ Command</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 text-sm text-muted font-bold leading-relaxed">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><MapPin size={16} className="text-emerald-500" /></div>
                                <span>Global Tech Hub, Suite 402<br />Silicon Boulevard, Kochi</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted font-bold group">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><Mail size={16} className="text-emerald-500" /></div>
                                <span className="group-hover:text-white transition-colors">ops@petco.intelligence</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Bottom Base --- */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Nodes Online</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">© 2026 PETCO Ecosystem</p>
                    </div>
                    
                    <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                        <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Protocol</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Service Terms</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">AI Ethics</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
