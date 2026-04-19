import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, HeartPulse, Brain, PawPrint, Star, Activity, Package, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isDoctor = user.role === 'Veterinarian' || user.role === 'doctor';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-midnight">
      
      {/* Cinematic Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none decorative-accent">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--midnight)_90%)]"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center"
      >
        {/* Elite Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full glass-premium border-white/10 mb-12"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-midnight bg-gradient-to-br ${i === 1 ? 'from-emerald-400 to-emerald-600' : i === 2 ? 'from-cyan-400 to-cyan-600' : 'from-blue-400 to-blue-600'}`}></div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400 shimmer" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Trusted by 15,000+ Vet Surgeons</span>
          </div>
        </motion.div>

        {/* Massive Typography */}
        <motion.div variants={itemVariants} className="max-w-7xl">
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black leading-[0.85] tracking-tighter text-white mb-10">
            {user.name ? (
              <>Welcome,<br /><span className="text-gradient">{user.name.split(' ')[0]}</span></>
            ) : (
              <>The Future of<br /><span className="text-gradient">Pet Care.</span></>
            )}
          </h1>

          <p className="text-xl sm:text-2xl text-muted font-bold leading-relaxed max-w-4xl mx-auto mb-16">
            {user.name
              ? "Re-aligning your companion's wellness with real-time neural diagnostics and elite surgical oversight."
              : "Synchronize with elite veterinary surgeons, deploy AI-driven health modeling, and access the world's most curated pet health infrastructure."}
          </p>
        </motion.div>

        {/* Primary CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-8 w-full sm:w-auto"
        >
          <Link to="/marketplace" className="btn-gradient group !px-12 !py-6 !text-sm flex items-center gap-4">
            Initialize Marketplace
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          {!isDoctor && (
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/doctor" className="glass-premium !rounded-3xl !py-6 !px-12 text-sm font-black uppercase tracking-widest text-white border-white/10 hover:border-emerald-500/30 transition-all hover:bg-emerald-500/5 backdrop-blur-3xl">
                Consult Neural Vet
              </Link>
              <Link to="/appointments" className="glass-premium !rounded-3xl !py-6 !px-10 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 border-white/10 hover:border-emerald-500/30 transition-all hover:bg-emerald-500/5 backdrop-blur-3xl flex items-center justify-center gap-3">
                <HeartPulse size={14} /> My Appointments
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* High-Fidelity Floating Cards */}
      <div className="absolute inset-0 z-0 hidden xl:block pointer-events-none">
        
        {/* AI Diagnostics */}
        <motion.div
          initial={{ y: 0, rotate: -6 }}
          animate={{ y: [-20, 20, -20], rotate: [-6, -4, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[5%] glass-premium p-6 rounded-[2.5rem] border-white/10 shadow-emerald-500/5 flex items-center gap-5 shimmer"
        >
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <Brain size={28} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-1">Neural AI</p>
            <p className="text-lg font-black text-white">99.9% Recall</p>
          </div>
        </motion.div>

        {/* Marketplace */}
        <motion.div
          initial={{ y: 0, rotate: 4 }}
          animate={{ y: [20, -20, 20], rotate: [4, 6, 4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[18%] left-[12%] glass-premium p-6 rounded-[2.5rem] border-white/10 shadow-cyan-500/5 flex items-center gap-5"
        >
          <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
            <Package size={28} className="text-cyan-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-1">Logistics</p>
            <p className="text-lg font-black text-white">Global Nodes</p>
          </div>
        </motion.div>

        {/* Health Monitoring */}
        <motion.div
          initial={{ y: 0, rotate: 8 }}
          animate={{ y: [-25, 25, -25], rotate: [8, 10, 8] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] right-[8%] glass-premium p-6 rounded-[2.5rem] border-white/10 shadow-blue-500/5 flex items-center gap-5"
        >
          <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <Activity size={28} className="text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1">Vital Link</p>
            <p className="text-lg font-black text-white">Real-time Stream</p>
          </div>
        </motion.div>

        {/* Vet Experts */}
        <motion.div
          initial={{ y: 0, rotate: -5 }}
          animate={{ y: [25, -25, 25], rotate: [-5, -7, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[22%] right-[10%] glass-premium p-6 rounded-[2.5rem] border-white/10 shadow-emerald-500/5 flex items-center gap-5 shimmer"
        >
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <ShieldCheck size={28} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-1">Verified Nodes</p>
            <p className="text-lg font-black text-white">15k+ Experts</p>
          </div>
        </motion.div>
      </div>

      {/* Cinematic Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-muted">Initialize Descent</div>
        <div className="relative w-1 h-16 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            animate={{ top: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-emerald-500 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
