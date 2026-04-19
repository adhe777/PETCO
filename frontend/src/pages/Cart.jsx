import React, { useState, useEffect } from 'react';
import { MapPin, Phone, User as UserIcon, Trash2, ArrowRight, Package, ShieldCheck, Tag, ShoppingBag, Sparkles, CreditCard, ChevronLeft, Loader2, Smartphone, Globe, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { API_URL } from '../config';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) return;
                const res = await axios.get(`${API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = res.data;
                setShippingDetails({
                    name: user.name || '',
                    phone: user.phone || '',
                    address: user.savedAddress || '',
                    city: user.city || '',
                    pincode: user.pincode || ''
                });
            } catch (err) {
                console.error("Failed to fetch profile for auto-suggestion:", err);
            } finally {
                setFetchingProfile(false);
            }
        };
        fetchProfile();
    }, []);
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const handleCheckout = async () => {
        if (cart.length === 0) return toast.error("Cart is empty");
        if (!shippingDetails.address || !shippingDetails.phone) return toast.error("Please provide shipping address and phone number");
        
        const loadingToast = toast.loading("Processing your order...");
        try {
            const orderData = {
                userId: user.id || user._id,
                products: cart.map(item => ({
                    productId: item._id || item.id,
                    quantity: item.quantity,
                    price: item.price,
                    sellerId: item.sellerId?._id || item.sellerId || "60d0fe4f5311236168a109ca"
                })),
                totalAmount: cartTotal,
                shippingAddress: shippingDetails.address,
                phone: shippingDetails.phone,
                city: shippingDetails.city,
                pincode: shippingDetails.pincode,
                paymentMethod,
                status: 'Pending'
            };

            await axios.post(`${API_URL}/api/orders`, orderData);
            
            toast.success('Order placed successfully!', { id: loadingToast });
            clearCart();
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            console.error(err);
            toast.error('Failed to place order. Please try again.', { id: loadingToast });
        }
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-midnight transition-colors duration-300 overflow-hidden">
            
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-16">
                    
                    <div className="lg:w-2/3 space-y-10">
                        <div className="flex items-center justify-between">
                            <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tight flex items-center gap-6">
                                <span className="text-gradient">Cart.</span>
                            </h1>
                            <Link to="/marketplace" className="px-6 py-3 rounded-2xl glass-premium border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-white transition-all flex items-center gap-3 group">
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Return to Shopping
                            </Link>
                        </div>

                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout">
                                {cart.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-20 border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-center opacity-30 group hover:opacity-50 transition-opacity"
                                    >
                                        <ShoppingBag className="mb-6 text-muted group-hover:scale-110 transition-transform" size={64} />
                                        <p className="font-black uppercase tracking-[0.5em] text-[12px] text-muted mb-4 text-white">Your cart is empty</p>
                                        <Link to="/marketplace" className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.3em]">Shop Products <ArrowRight size={12} className="inline ml-2" /></Link>
                                    </motion.div>
                                ) : (
                                    cart.map((item) => (
                                        <motion.div 
                                            key={item._id || item.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="glass-premium p-8 rounded-[3rem] border-white/5 flex flex-col sm:flex-row items-center gap-10 shadow-2xl relative group overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            
                                            <div className="w-32 h-32 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 relative overflow-hidden shrink-0 shadow-2xl group-hover:scale-105 transition-transform">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                                                ) : (
                                                    <Package className="text-white/10" size={40} />
                                                )}
                                            </div>

                                            <div className="flex-1 text-center sm:text-left">
                                                <div className="flex items-center gap-3 justify-center sm:justify-start mb-3">
                                                    <h3 className="font-black text-2xl text-white tracking-tight group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                                                </div>
                                                <p className="text-[10px] text-muted font-black uppercase tracking-[0.4em] mb-6">{item.category}</p>
                                                
                                                <div className="flex flex-col sm:flex-row items-center gap-8">
                                                    <div className="text-3xl font-black text-white tracking-tighter">
                                                        <span className="text-sm font-bold text-muted mr-1">₹</span>{item.price.toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center gap-6 glass-premium px-4 py-2 rounded-2xl border-white/10 shadow-xl">
                                                        <button 
                                                            onClick={() => updateQuantity(item._id || item.id, -1)} 
                                                            className="text-muted hover:text-emerald-500 transition-colors p-2 active:scale-90"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-sm font-black text-white border-x border-white/10 px-6">{item.quantity.toString().padStart(2, '0')}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item._id || item.id, 1)} 
                                                            className="text-muted hover:text-emerald-500 transition-colors p-2 active:scale-90"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => removeFromCart(item._id || item.id)} 
                                                className="p-4 rounded-2xl glass-premium border-white/10 text-muted hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95 shadow-2xl"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="lg:w-1/3 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-premium p-10 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 p-10 opacity-[0.05] pointer-events-none">
                                <CreditCard size={100} className="text-cyan-500" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-8 tracking-tight uppercase flex items-center gap-3">
                                <CreditCard size={18} className="text-cyan-500" /> Payment Method
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'Card', icon: CreditCard, label: 'Card' },
                                    { id: 'UPI', icon: Smartphone, label: 'UPI' },
                                    { id: 'PayPal', icon: Globe, label: 'PayPal' },
                                    { id: 'Cash on Delivery', icon: Banknote, label: 'COD' }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === method.id ? 'bg-cyan-500/10 border-cyan-500 text-cyan-500 shadow-lg shadow-cyan-500/10' : 'border-white/10 text-muted hover:border-cyan-500/40'}`}
                                    >
                                        <method.icon size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-premium p-10 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 p-10 opacity-[0.05] pointer-events-none">
                                <MapPin size={100} className="text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-8 tracking-tight uppercase flex items-center gap-3">
                                <MapPin size={18} className="text-emerald-500" /> Shipping Details
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted ml-2">Receiver Name</label>
                                    <div className="relative">
                                        <UserIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                                        <input 
                                            type="text" 
                                            placeholder="Full Name"
                                            value={shippingDetails.name}
                                            onChange={(e) => setShippingDetails({...shippingDetails, name: e.target.value})}
                                            className="glass-input !pl-12 !py-3 text-xs" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted ml-2">Contact Number</label>
                                    <div className="relative">
                                        <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                                        <input 
                                            type="text" 
                                            placeholder="+91 00000 00000"
                                            value={shippingDetails.phone}
                                            onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                                            className="glass-input !pl-12 !py-3 text-xs" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted ml-2">Street Address</label>
                                    <textarea 
                                        placeholder="Flat, House no., Building, Company, Apartment"
                                        value={shippingDetails.address}
                                        onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                                        className="glass-input !py-3 text-xs h-20 resize-none" 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted ml-2">City</label>
                                        <input 
                                            type="text" 
                                            placeholder="City"
                                            value={shippingDetails.city}
                                            onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                                            className="glass-input !py-3 text-xs" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted ml-2">PIN Code</label>
                                        <input 
                                            type="text" 
                                            placeholder="000 000"
                                            value={shippingDetails.pincode}
                                            onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})}
                                            className="glass-input !py-3 text-xs" 
                                        />
                                    </div>
                                </div>
                                <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest text-center mt-4">
                                    ✨ Amazon-style auto-save enabled
                                </p>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-premium p-10 lg:p-12 rounded-[4rem] border-white/10 shadow-[0_0_100px_rgba(16,185,129,0.05)] sticky top-32 overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-[100px]"></div>

                            <h2 className="text-3xl font-black text-white mb-12 tracking-tight uppercase flex items-center justify-between">
                                Summary
                                <CreditCard size={24} className="text-emerald-500" />
                            </h2>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center group">
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em] group-hover:text-white transition-colors">Subtotal</span>
                                    <span className="text-lg font-black text-white tracking-tighter">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em] group-hover:text-white transition-colors">Shipping</span>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Free</span>
                                </div>
                                <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">Total</span>
                                    <div className="text-5xl font-black text-white tracking-tighter shadow-emerald-500/10">
                                        <span className="text-xl font-bold text-muted mr-1">₹</span>{cartTotal.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {user.role === 'admin' || user.role === 'Administrator' ? (
                                <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-amber-500 font-bold text-center text-xs uppercase tracking-widest leading-relaxed">
                                    Administrative accounts are restricted from placing orders. 
                                </div>
                            ) : (
                                <button 
                                    onClick={handleCheckout} 
                                    disabled={cart.length === 0}
                                    className="btn-primary w-full !py-6 !text-[11px] !font-black flex items-center justify-center gap-4 group shadow-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    PLACE ORDER
                                    <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                                </button>
                            )}

                            <div className="mt-10 flex flex-col gap-4">
                                <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 group hover:border-emerald-500/30 transition-all">
                                    <ShieldCheck className="text-emerald-500 group-hover:scale-110 transition-transform" size={20} />
                                    <div>
                                        <p className="text-[9px] font-black text-white uppercase tracking-[0.3em] mb-0.5">Secure Payment</p>
                                        <p className="text-[8px] font-black text-muted uppercase tracking-widest">Your data is safe with us</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 group hover:border-cyan-500/30 transition-all">
                                    <Tag className="text-cyan-500 group-hover:rotate-12 transition-transform" size={20} />
                                    <div>
                                        <p className="text-[9px] font-black text-white uppercase tracking-[0.3em] mb-0.5">Safe Delivery</p>
                                        <p className="text-[8px] font-black text-muted uppercase tracking-widest">Verified shipping partners</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
