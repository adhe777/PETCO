import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ShoppingCart,
    Plus,
    Trash2,
    Edit,
    Sparkles,
    CheckCircle2,
    Clock,
    TrendingUp,
    Box,
    DollarSign,
    Brain,
    Send,
    Loader2,
    Activity,
    ChevronRight,
    ArrowRight,
    ShieldCheck,
    CreditCard
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const SellerDashboard = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        name: '',
        price: '',
        category: 'food',
        stock: '',
        image: '',
        description: ''
    });

    // AI State
    const [aiInput, setAiInput] = useState({ name: '', category: 'food' });
    const [aiResult, setAiResult] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [prodRes, orderRes] = await Promise.all([
                axios.get(`${API_URL}/api/products/seller/${user.id || user._id}`),
                axios.get(`${API_URL}/api/orders/seller/${user.id || user._id}`)
            ]);
            setProducts(prodRes.data);
            setOrders(orderRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    const runAiAssistant = async () => {
        if (!aiInput.name) return toast.error("Product name required for AI assistant");
        setIsAiLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/ai/seller-assist`, {
                productName: aiInput.name,
                category: aiInput.category
            });
            setAiResult(res.data);
            toast.success("Product details generated");
        } catch (err) {
            toast.error("AI connection failed");
        } finally {
            setIsAiLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status });
            toast.success(`Order status updated to ${status}`);
            fetchData();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Delete this product?")) {
            try {
                await axios.delete(`${API_URL}/api/products/${id}`);
                toast.success("Product deleted");
                fetchData();
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...currentProduct,
                sellerId: user.id || user._id,
                price: Number(currentProduct.price),
                stock: Number(currentProduct.stock)
            };

            if (isEditing) {
                await axios.put(`${API_URL}/api/products/${currentProduct._id}`, productData);
                toast.success("Product updated successfully");
            } else {
                await axios.post(`${API_URL}/api/products`, productData);
                toast.success("Product added to inventory");
            }

            setShowModal(false);
            fetchData();
            setCurrentProduct({ name: '', price: '', category: 'food', stock: '', image: '', description: '' });
        } catch (err) {
            toast.error("Failed to save product");
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-premium border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        <TrendingUp size={12} />
                        System Administrator
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.9]">
                        Admin <br />
                        <span className="text-emerald-500">Dashboard.</span>
                    </h1>
                    <p className="text-xl text-muted font-bold mt-4">Managing: {user.eligibilityInfo?.storeName || 'the Platform'}</p>
                </div>

                <div className="flex flex-wrap gap-6">
                    <div className="glass-premium border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-emerald-500/[0.02]"></div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted mb-2">Total Sales</p>
                        <p className="text-4xl font-black text-emerald-400 tracking-tighter">₹42,850</p>
                    </div>
                    <div className="glass-premium border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cyan-500/[0.02]"></div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted mb-2">Active Orders</p>
                        <p className="text-4xl font-black text-cyan-400 tracking-tighter">{orders.filter(o => o.status !== 'Delivered').length}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 p-2 glass-premium border-white/10 rounded-[2rem] w-fit">
                {[
                    { id: 'products', label: 'Products', icon: Package },
                    { id: 'orders', label: 'Orders', icon: ShoppingCart },
                    { id: 'ai', label: 'AI Assistant', icon: Brain },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 ${activeTab === tab.id
                                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'
                                : 'text-muted hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="min-h-[60vh]"
                >
                    {activeTab === 'products' && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                                    <Package className="text-emerald-500" />
                                    Product List
                                </h2>
                                <button 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCurrentProduct({ name: '', price: '', category: 'food', stock: '', image: '', description: '' });
                                        setShowModal(true);
                                    }}
                                    className="bg-emerald-500 text-white px-8 py-5 text-[10px] font-black rounded-2xl flex items-center gap-3 active:scale-95 shadow-xl shadow-emerald-500/20"
                                >
                                    <Plus size={18} /> ADD PRODUCT
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {isLoading ? (
                                    <div className="col-span-full py-40 text-center"><Loader2 className="animate-spin text-emerald-500 mx-auto" size={48} /></div>
                                ) : products.length === 0 ? (
                                    <div className="col-span-full py-40 text-center glass-premium border-2 border-dashed border-white/5 rounded-[4rem] group opacity-30 hover:opacity-50 transition-opacity">
                                        <Package size={64} className="mx-auto mb-8 text-muted group-hover:scale-110 transition-transform" />
                                        <p className="text-xl font-black text-white mb-2 uppercase tracking-tight">No Products Found</p>
                                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Add your first product to get started.</p>
                                    </div>
                                ) : (
                                    products.map(product => (
                                        <motion.div 
                                            key={product._id} 
                                            whileHover={{ y: -10 }}
                                            className="glass-premium border-white/5 rounded-[3rem] p-8 shadow-2xl group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="h-60 rounded-[2.5rem] glass-premium border-white/10 mb-8 overflow-hidden relative shadow-2xl">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0" />
                                                ) : (
                                                    <Box className="text-white/5 mx-auto" size={80} />
                                                )}
                                                <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-midnight/80 backdrop-blur-md border border-white/10 text-white font-black text-[10px] tracking-widest shadow-2xl">
                                                    Stock: {product.stock}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">{product.name}</h3>
                                                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase text-muted tracking-[0.2em]">
                                                        {product.category}
                                                    </span>
                                                </div>
                                                <p className="text-3xl font-black text-white tracking-tighter">
                                                    <span className="text-sm font-bold text-muted mr-1">₹</span>{product.price}
                                                </p>
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                                                <button 
                                                    onClick={() => {
                                                        setIsEditing(true);
                                                        setCurrentProduct(product);
                                                        setShowModal(true);
                                                    }}
                                                    className="flex-1 py-4 glass-premium border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-white hover:border-emerald-500/30 transition-all active:scale-95 shadow-2xl"
                                                >
                                                    <Edit size={16} className="inline mr-3" /> Edit Product
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product._id)}
                                                    className="p-4 glass-premium border-white/10 rounded-2xl text-red-500/60 hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95 shadow-2xl"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-10">
                            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                                <ShoppingCart className="text-cyan-500" />
                                Manage Orders
                            </h2>
                            {orders.length === 0 ? (
                                <div className="py-40 text-center glass-premium border-2 border-dashed border-white/5 rounded-[4rem] opacity-30">
                                    <ShoppingCart size={64} className="mx-auto mb-8 text-muted" />
                                    <p className="text-xl font-black text-white mb-2 uppercase tracking-tight">No orders yet</p>
                                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Once customers place orders, they will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {orders.map(order => (
                                        <motion.div 
                                            key={order._id} 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="glass-premium border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-cyan-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="flex flex-col xl:flex-row justify-between gap-10">
                                                <div className="flex gap-8">
                                                    <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/5 group-hover:scale-110 transition-transform shrink-0 overflow-hidden">
                                                        <Clock size={36} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-4 mb-3">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
                                                            <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-md text-[8px] font-black text-cyan-400 uppercase tracking-widest">URGENT</div>
                                                        </div>
                                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">Customer: {order.userId?.name}</h3>
                                                        <p className="text-sm text-cyan-500 font-bold uppercase tracking-widest opacity-60 flex items-center gap-2 italic">
                                                            <Send size={14} /> {order.userId?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center xl:items-end justify-between gap-6">
                                                    <div className="relative group/select">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                            className="glass-input !py-4 !px-8 !pr-12 text-[10px] font-black uppercase tracking-[0.3em] text-center appearance-none cursor-pointer hover:border-cyan-500/30 transition-all shadow-2xl"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted"><ChevronRight size={14} className="rotate-90" /></div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-4xl font-black text-white tracking-tighter">
                                                        <span className="text-xl font-bold text-muted mt-1">₹</span>{order.totalAmount}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-10 pt-10 border-t border-white/5 flex flex-wrap gap-4">
                                                {order.products.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 px-6 py-4 glass-premium border-white/10 rounded-2xl group/tag hover:border-cyan-500/30 transition-all shadow-xl">
                                                        <Box size={18} className="text-muted group-hover/tag:text-cyan-400 transition-colors" />
                                                        <div>
                                                            <p className="text-[10px] font-black text-white tracking-tight uppercase">{item.productId?.name}</p>
                                                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="max-w-3xl mx-auto py-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-premium border-white/10 rounded-[4rem] p-12 lg:p-20 shadow-[0_0_100px_rgba(16,185,129,0.1)] relative overflow-hidden"
                            >
                                <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]"></div>
                                
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
                                        <Brain size={16} />
                                        AI PRODUCT ASSISTANT
                                    </div>
                                    <h2 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">Generate <span className="text-emerald-500">Descriptions.</span></h2>
                                    <p className="text-xl text-muted font-bold mb-16 leading-relaxed">
                                        Use AI to write professional product titles, descriptions, and tags for your listings.
                                    </p>

                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted ml-2">Product Name</label>
                                            <input
                                                type="text"
                                                value={aiInput.name}
                                                onChange={(e) => setAiInput({ ...aiInput, name: e.target.value })}
                                                className="glass-input !py-6 !px-10 text-xl font-black placeholder:opacity-20"
                                                placeholder="e.g. Dog Treats"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted ml-2">Category</label>
                                            <select
                                                value={aiInput.category}
                                                onChange={(e) => setAiInput({ ...aiInput, category: e.target.value })}
                                                className="glass-input !py-6 !px-10 text-lg font-black uppercase tracking-widest appearance-none cursor-pointer"
                                            >
                                                <option value="food">Food</option>
                                                <option value="toys">Toys</option>
                                                <option value="health">Health</option>
                                                <option value="accessories">Accessories</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={runAiAssistant}
                                            disabled={isAiLoading}
                                            className="bg-emerald-500 text-white w-full !py-7 !text-[12px] !font-black !tracking-[0.4em] flex items-center justify-center gap-6 shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all group disabled:opacity-5 w-auto"
                                        >
                                            {isAiLoading ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={24} /> GENERATE DESCRIPTION</>}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {aiResult && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-16 pt-16 border-t border-white/10 group"
                                            >
                                                <div className="flex items-center gap-4 mb-8 text-emerald-400">
                                                    <CheckCircle2 size={24} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">AI GENERATED</span>
                                                </div>
                                                <div className="glass-premium border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-emerald-500/[0.02]"></div>
                                                    <h4 className="text-3xl font-black text-white mb-6 tracking-tight group-hover:text-emerald-400 transition-colors">{aiResult.title}</h4>
                                                    <p className="text-lg font-bold text-muted leading-relaxed mb-10 italic opacity-80 decoration-emerald-500/20 underline underline-offset-8">
                                                        "{aiResult.suggestion}"
                                                    </p>
                                                    <div className="flex flex-wrap gap-4">
                                                        {aiResult.tags && aiResult.tags.map((tag, idx) => (
                                                            <span key={idx} className="text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shadow-2xl">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button className="mt-10 w-full flex items-center justify-center gap-4 text-[10px] font-black text-muted uppercase tracking-[0.6em] group/apply hover:text-white transition-all">
                                                    USE THIS DESCRIPTION <ArrowRight size={16} className="group-hover/apply:translate-x-6 transition-transform" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-midnight/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-midnight-soft border border-white/10 rounded-[3rem] p-10 lg:p-12 w-full max-w-2xl shadow-2xl relative overflow-hidden"
                        >
                             <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]"></div>
                            
                            <h2 className="text-4xl font-black text-white mb-10 tracking-tight">
                                {isEditing ? 'Edit Product' : 'Add New Product'}
                            </h2>

                            <form onSubmit={handleProductSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted ml-2">Product Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentProduct.name}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                            className="glass-input !py-4"
                                            placeholder="Dog Collar"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted ml-2">Category</label>
                                        <select
                                            value={currentProduct.category}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                            className="glass-input !py-4 uppercase tracking-widest text-xs font-black"
                                        >
                                            <option value="food">Food</option>
                                            <option value="toys">Toys</option>
                                            <option value="health">Health</option>
                                            <option value="accessories">Accessories</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted ml-2">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={currentProduct.price}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                            className="glass-input !py-4"
                                            placeholder="1200"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted ml-2">Stock Count</label>
                                        <input
                                            type="number"
                                            required
                                            value={currentProduct.stock}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                                            className="glass-input !py-4"
                                            placeholder="50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted ml-2">Image URL</label>
                                    <input
                                        type="text"
                                        value={currentProduct.image}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                                        className="glass-input !py-4"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted ml-2">Description</label>
                                    <textarea
                                        rows="3"
                                        value={currentProduct.description}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        className="glass-input !py-4 resize-none"
                                        placeholder="Enter product description..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-5 glass-premium border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-emerald-500 text-white rounded-2xl !py-5 !text-[10px] shadow-emerald-500/20"
                                    >
                                        {isEditing ? 'SAVE CHANGES' : 'ADD PRODUCT'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5 opacity-30">
                <div className="flex items-center gap-4">
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Secured Admin Panel v12.4.0</p>
                </div>
                <div className="flex items-center gap-8">
                    <CreditCard size={20} className="text-muted" />
                    <Activity size={20} className="text-muted" />
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
