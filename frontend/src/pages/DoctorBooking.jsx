import axios from 'axios';
import { API_URL } from '../config';
import { Calendar as CalendarIcon, Clock, Heart, ShieldCheck, Star, MapPin, ArrowRight, Video, ChevronRight, Sparkles, Activity, ShieldAlert, Dog, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorBooking = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [activeDoctor, setActiveDoctor] = useState(null);
    const [petName, setPetName] = useState('');
    const [reason, setReason] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [isBooking, setIsBooking] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/api/auth/doctors`);
                const realDoctors = res.data.map((doc, idx) => ({
                    id: doc._id,
                    name: `Dr. ${doc.name?.replace('Dr. ', '') || 'Vet'}`,
                    spec: doc.specialization || "Veterinary Professional",
                    exp: doc.experience ? `${doc.experience} Years` : "5+ Years",
                    rating: (4.8 + (idx % 3) * 0.1).toFixed(1),
                    reviews: 120 + idx * 15,
                    image: doc.name?.charAt(0) || "D",
                    location: doc.clinicAddress || "Premium Clinical Care",
                    nextAvailable: idx % 2 === 0 ? "Today" : "Tomorrow",
                    price: `₹${800 + idx * 100}`
                }));
                
                if (realDoctors.length > 0) {
                    setDoctors(realDoctors);
                } else {
                    setDoctors([
                        {
                            id: 1, name: "Dr. Anjali Nair", spec: "Veterinary Surgeon",
                            exp: "12+ Years", rating: 4.9, reviews: 128, image: "AN",
                            location: "Kochi, Kerala", nextAvailable: "Today", price: "₹850"
                        }
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch doctors:", err);
                toast.error("Could not load veterinary experts");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const timeSlots = ["09:00 AM", "10:30 AM", "02:00 PM", "04:15 PM", "06:00 PM"];
    const dates = ["Today", "Tomorrow", "Wed, 24", "Thu, 25", "Fri, 26"];

    return (
        <div className="pt-32 pb-20 min-h-screen bg-midnight transition-colors duration-300 overflow-x-hidden">
            
            <div className="fixed inset-0 pointer-events-none -z-10 bg-midnight">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl">
                <div className="mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-premium border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                        <Sparkles size={12} /> Expert Doctors
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">
                        Elite <span className="text-emerald-500">Care.</span>
                    </h1>
                    <p className="text-lg text-emerald-100/60 font-bold max-w-2xl">
                        Schedule an appointment with our verified expert veterinarians.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">Locating Experts...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {doctors.length === 0 ? (
                            <div className="glass-premium p-20 text-center rounded-[3rem] border-white/5">
                                <Activity className="mx-auto text-emerald-500 mb-6" size={48} />
                                <h3 className="text-2xl font-black text-white mb-2">No Experts Available</h3>
                                <p className="text-muted text-sm px-6">We're currently connecting modern veterinary experts.</p>
                            </div>
                        ) : (
                            doctors.map((doc) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={doc.id} 
                                    className="glass-premium border-white/5 rounded-[2.5rem] group hover:border-emerald-500/30 transition-all overflow-hidden"
                                >
                                    <div className="flex flex-col xl:flex-row">
                                        <div className="p-8 lg:p-12 flex-1 flex flex-col sm:flex-row gap-8 items-start border-b xl:border-b-0 xl:border-r border-white/5">
                                            <div className="w-24 h-24 shrink-0 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-3xl font-black text-white shadow-lg">
                                                {doc.image}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-black text-white">{doc.name}</h3>
                                                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest">Verified</span>
                                                </div>
                                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-4">{doc.spec}</p>
                                                
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-muted uppercase tracking-widest">Exp</p>
                                                        <p className="text-sm font-bold text-white">{doc.exp}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-muted uppercase tracking-widest">Rating</p>
                                                        <div className="flex items-center gap-1.5 text-emerald-500"><Star size={12} fill="currentColor" /><span className="text-sm font-bold text-white">{doc.rating}</span></div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-muted uppercase tracking-widest">City</p>
                                                        <p className="text-sm font-bold text-white line-clamp-1">{doc.location}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-3">
                                                    <div className="px-3 py-1.5 rounded-xl bg-white/5 text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2 border border-white/10"><Video size={12} className="text-emerald-500" /> Video</div>
                                                    <div className="px-3 py-1.5 rounded-xl bg-white/5 text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2 border border-white/10"><MapPin size={12} className="text-cyan-500" /> Clinic</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 lg:p-12 xl:w-80 shrink-0 bg-white/[0.02] flex flex-col justify-center">
                                            <div className="mb-6">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Fee</p>
                                                <div className="text-4xl font-black text-white tracking-tighter">
                                                    ₹{doc.price.replace('₹', '')}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setActiveDoctor(activeDoctor === doc.id ? null : doc.id)}
                                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                                                    activeDoctor === doc.id 
                                                    ? 'bg-white text-midnight' 
                                                    : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 active:scale-95'
                                                }`}
                                            >
                                                {activeDoctor === doc.id ? 'CLOSE' : 'BOOK SESSION'}
                                                <ChevronRight size={16} className={`transition-all ${activeDoctor === doc.id ? 'rotate-90' : ''}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {activeDoctor === doc.id && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5 bg-white/[0.03] p-8 lg:p-12 overflow-hidden"
                                            >
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                                                    <div className="space-y-6">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2"><CalendarIcon size={14} /> 1. Select Date</h4>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {dates.map((date, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => setSelectedDate(date)}
                                                                    className={`py-4 px-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${selectedDate === date ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'border-white/10 text-muted hover:border-emerald-500/40'}`}
                                                                >
                                                                    {date}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2"><Clock size={14} /> 2. Select Time</h4>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {timeSlots.map((time, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => setSelectedTime(time)}
                                                                    className={`py-4 px-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${selectedTime === time ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'border-white/10 text-muted hover:border-cyan-500/40'}`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Pet Name</label>
                                                        <input type="text" placeholder="Tommy..." value={petName} onChange={(e) => setPetName(e.target.value)} className="glass-input !py-4" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Visit Reason</label>
                                                        <input type="text" placeholder="General Checkup..." value={reason} onChange={(e) => setReason(e.target.value)} className="glass-input !py-4" />
                                                    </div>
                                                </div>

                                                {!selectedDate || !selectedTime ? (
                                                    <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-3">
                                                        <AlertCircle size={16} className="text-cyan-500" />
                                                        <p className="text-[9px] font-black text-cyan-500/80 uppercase tracking-widest">Select a Date and Time slot above to continue</p>
                                                    </div>
                                                ) : (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Activity size={20} /></div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-muted uppercase tracking-widest">Scheduled Slot</p>
                                                                <p className="text-xl font-black text-white">{selectedDate} <span className="text-emerald-500 mx-1">/</span> {selectedTime}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            disabled={isBooking || !petName}
                                                            onClick={async () => {
                                                                try {
                                                                     setIsBooking(true);
                                                                     const token = sessionStorage.getItem('token');
                                                                     const dateObj = new Date();
                                                                     if (selectedDate === 'Tomorrow') dateObj.setDate(dateObj.getDate() + 1);
                                                                     
                                                                     await axios.post(`${API_URL}/api/appointments/book`, {
                                                                         doctorId: doc.id,
                                                                         date: dateObj.toISOString().split('T')[0],
                                                                         time: selectedTime,
                                                                         petName,
                                                                         reason
                                                                     }, { headers: { Authorization: `Bearer ${token}` } });

                                                                     toast.success("Appointment Confirmed!");
                                                                     setActiveDoctor(null); setSelectedDate(null); setSelectedTime(null);
                                                                     setPetName(''); setReason('');
                                                                 } catch (err) {
                                                                     toast.error("Scheduling failed");
                                                                 } finally {
                                                                     setIsBooking(false);
                                                                 }
                                                            }}
                                                            className="btn-gradient !py-5 !px-12 !text-[10px] w-full md:w-auto shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all border border-white/10"
                                                        >
                                                            {isBooking ? 'CONFIRMING...' : 'FINALIZE BOOKING'}
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorBooking;
