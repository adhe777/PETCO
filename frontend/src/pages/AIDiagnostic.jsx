import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Upload, Activity, Send, User, Bot, Trash2, Cpu, Zap, ShieldAlert, CheckCircle2, Terminal } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const AIDiagnostic = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: "Hello! I'm your AI pet care assistant. Please describe any symptoms or behavior changes you've noticed in your pet.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAnalyzing]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isAnalyzing) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            content: input.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsAnalyzing(true);

        try {
            const res = await axios.post(`${API_URL}/api/ai/diagnose`, { message: currentInput });

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                content: res.data.response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (err) {
            toast.error("Failed to connect to AI. Please check your internet.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearChat = () => {
        setMessages([{
            id: 1,
            type: 'bot',
            content: "Chat cleared. How can I help you today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    return (
        <div className="pt-24 min-h-screen bg-midnight transition-colors duration-300 flex flex-col overflow-hidden">
            
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-6 max-w-5xl flex-1 flex flex-col pb-12">

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center glass-premium border-white/10 p-8 mb-10 shadow-emerald-500/5"
                >
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-5 bg-emerald-500 rounded-3xl shadow-2xl shadow-emerald-500/20">
                                <Brain className="text-white" size={32} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-midnight rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Smart Care AI</h2>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black text-emerald-400 uppercase tracking-widest">Online</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Activity size={10} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Active</span>
                                </div>
                                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                    <Zap size={10} className="text-cyan-500" />
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Fast Response</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <button
                            onClick={clearChat}
                            className="p-4 glass-premium border-white/10 text-muted hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95 group"
                            title="Clear Chat"
                        >
                            <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                <div className="flex-1 flex flex-col glass-premium border-white/5 shadow-2xl overflow-hidden backdrop-blur-3xl relative min-h-[500px]">
                    
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-[20%] right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-[20%] left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"></div>
                    </div>

                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scroll-smooth custom-scrollbar"
                    >
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start gap-5 max-w-[75%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-all ${msg.type === 'user'
                                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                                : 'glass-premium text-emerald-400 border-white/10'
                                            }`}>
                                            {msg.type === 'user' ? <User size={24} /> : <Bot size={24} />}
                                        </div>

                                        <div className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-6 py-5 rounded-[2rem] text-lg font-bold leading-relaxed shadow-2xl transition-all ${msg.type === 'user'
                                                    ? 'bg-emerald-500 text-white rounded-tr-none'
                                                    : 'glass-premium text-white rounded-tl-none border-white/10 border-l-emerald-500/40 border-l-4'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <div className="flex items-center gap-3 mt-3 px-2">
                                                <span className="text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-40">
                                                    {msg.time}
                                                </span>
                                                {msg.type === 'bot' && (
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle2 size={10} className="text-emerald-500" />
                                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified Result</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isAnalyzing && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-start gap-5 max-w-[85%]">
                                        <div className="w-14 h-14 rounded-2xl glass-premium border-white/10 flex items-center justify-center shrink-0">
                                            <Sparkles size={24} className="text-emerald-400 animate-spin" />
                                        </div>
                                        <div className="glass-premium border-white/10 border-l-4 border-l-emerald-500/40 px-8 py-5 rounded-[2rem] rounded-tl-none shadow-2xl flex items-center gap-6">
                                            <div className="flex gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                            <span className="text-xs font-black text-white uppercase tracking-[0.4em]">
                                                Analyzing symptoms...
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-8 bg-midnight-soft/30 border-t border-white/5 backdrop-blur-2xl">
                        <form onSubmit={handleSend} className="flex items-center gap-6">
                            <div className="flex-1 relative group">
                                <button type="button" className="absolute left-6 top-1/2 -translate-y-1/2 text-muted hover:text-emerald-400 transition-all">
                                    <Upload size={22} />
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your pet's symptoms..."
                                    className="glass-input !pl-16 !pr-10 !py-6 text-xl"
                                    disabled={isAnalyzing}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted uppercase tracking-widest hidden md:block">
                                    Press Enter to send
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!input.trim() || isAnalyzing}
                                className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-95 group ${input.trim() && !isAnalyzing
                                        ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-110'
                                        : 'glass-premium text-muted border-white/10 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <Send size={24} className={`transition-transform duration-500 group-hover:rotate-[-45deg] ${input.trim() && !isAnalyzing ? 'translate-x-[2px] -translate-y-[2px]' : ''}`} />
                            </button>
                        </form>
                        <div className="mt-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <ShieldAlert size={12} className="text-amber-500" />
                                <p className="text-[9px] text-muted font-black uppercase tracking-[0.2em]">
                                    AI suggestions are for guidance only. Please consult a doctor for serious issues.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIDiagnostic;
