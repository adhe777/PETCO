import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Star, Plus, ArrowRight, Filter, Search, ChevronRight, Tag, X, Eye, ShoppingCart, ArrowUpDown, Sparkles, Cpu, Layers, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { API_URL } from '../config';

const Marketplace = () => {
    const [activeCategory, setActiveCategory] = useState('All Products');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('Featured');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/products`);
                setProducts(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        { name: 'All Products', count: products.length, icon: Layers },
        { name: 'food', count: products.filter(p => (p.category || '').toLowerCase() === 'food').length, icon: ShoppingBag },
        { name: 'tech', count: products.filter(p => (p.category || '').toLowerCase() === 'tech').length, icon: Cpu },
        { name: 'apparel', count: products.filter(p => (p.category || '').toLowerCase() === 'apparel').length, icon: Tag },
        { name: 'wellness', count: products.filter(p => (p.category || '').toLowerCase() === 'wellness').length, icon: Sparkles }
    ];

    const filteredAndSortedProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchesCategory = activeCategory === 'All Products' || (p.category || '').toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        switch (sortOption) {
            case 'Price: Low to High':
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case 'Price: High to Low':
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case 'Top Rated':
                result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                break;
        }

        return result;
    }, [activeCategory, searchQuery, sortOption]);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-midnight transition-colors duration-300 overflow-hidden">
            
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-6">

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-20 gap-12">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-premium border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            <Sparkles size={12} />
                            Premium Selection
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[0.9]">
                            Pet <br />
                            <span className="text-gradient">Marketplace.</span>
                        </h1>
                        <p className="text-xl text-muted font-bold max-w-2xl leading-relaxed">
                            Discover the best products for your pet's health, happiness, and style. All items are vet-approved and premium quality.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
                        <div className="relative group w-full xl:w-80">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald-500 transition-colors">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="glass-input !pl-16 !pr-6 !py-5 text-lg font-bold"
                            />
                        </div>

                        <div className="relative group w-full sm:w-64">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                <ArrowUpDown size={20} />
                            </div>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="glass-input !pl-16 !pr-10 !py-5 text-sm font-black uppercase tracking-widest appearance-none cursor-pointer"
                            >
                                <option>Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Top Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">

                    <div className="lg:w-1/4 xl:w-1/5 shrink-0">
                        <div className="sticky top-32 space-y-12">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted mb-8 flex items-center gap-3">
                                    <Filter size={14} className="text-emerald-500" /> Categories
                                </h3>
                                <ul className="space-y-4">
                                    {categories.map((cat, idx) => (
                                        <li key={idx}>
                                            <button
                                                onClick={() => setActiveCategory(cat.name)}
                                                className={`w-full text-left px-6 py-4 rounded-2xl flex items-center justify-between transition-all group ${activeCategory === cat.name
                                                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                                    : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <cat.icon size={18} className={activeCategory === cat.name ? 'text-emerald-400' : 'text-muted group-hover:text-emerald-500 transition-colors'} />
                                                    <span className="text-sm font-black uppercase tracking-widest">{cat.name}</span>
                                                </div>
                                                <span className={`text-[10px] font-black ${activeCategory === cat.name ? 'text-emerald-400' : 'text-muted opacity-50'}`}>
                                                    {cat.count}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-3/4 xl:w-4/5">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-96 opacity-30">
                                <Loader2 className="animate-spin mb-6 text-emerald-500" size={48} />
                                <p className="font-black uppercase tracking-[0.5em] text-[10px]">Loading products...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min">
                                <AnimatePresence mode="popLayout">
                                    {filteredAndSortedProducts.length === 0 ? (
                                        <div className="col-span-full py-32 text-center opacity-30">
                                            <Search className="mx-auto mb-6 text-muted" size={48} />
                                            <p className="font-black uppercase tracking-[0.5em] text-[10px]">No products found</p>
                                        </div>
                                    ) : (
                                        filteredAndSortedProducts.map((p, i) => (
                                            <motion.div
                                                layout
                                                key={p._id || p.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className={`glass-premium flex flex-col group hover:border-emerald-500/30 transition-all border-white/5 overflow-hidden ${p.span || 'col-span-1'}`}
                                            >
                                                <div className="h-72 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative overflow-hidden">
                                                    {p.isNew && (
                                                        <div className="absolute top-5 left-5 z-10">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-xl shadow-emerald-500/20">
                                                                New
                                                            </span>
                                                        </div>
                                                    )}

                                                    <img 
                                                        src={p.image || "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&q=80&w=800"} 
                                                        alt={p.name} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                                                    />

                                                    <div className="absolute inset-0 bg-midnight/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                                        <button
                                                            onClick={() => setSelectedProduct(p)}
                                                            className="translate-y-8 group-hover:translate-y-0 transition-all duration-500 btn-primary !px-8 !py-4 !text-[10px] flex items-center gap-3 group/btn shadow-2xl"
                                                        >
                                                            <Eye size={16} /> QUICK VIEW
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="p-8 flex flex-col flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em]">{p.category}</p>
                                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                                                            <Star size={12} className="text-emerald-400 fill-emerald-400" />
                                                            <span className="text-[10px] font-black text-white">{p.rating || '4.5'}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <h3 className="font-black text-2xl mb-8 text-white line-clamp-2 tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">
                                                        {p.name}
                                                    </h3>

                                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                                        <div className="text-3xl font-black text-white tracking-tighter">
                                                            <span className="text-sm font-bold text-muted mr-1">₹</span>
                                                            {p.price.toLocaleString()}
                                                        </div>

                                                        <button 
                                                            onClick={() => addToCart(p)} 
                                                            className="w-14 h-14 glass-premium flex items-center justify-center rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group/add active:scale-95"
                                                        >
                                                            <Plus size={24} className="text-white group-hover/add:rotate-90 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-midnight/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-5xl glass-premium border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)] flex flex-col md:flex-row min-h-[600px]"
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-8 right-8 z-20 w-12 h-12 rounded-2xl glass-premium border-white/10 text-white flex items-center justify-center hover:bg-white/5 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="w-full md:w-1/2 relative bg-midnight-soft">
                                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent md:bg-gradient-to-r" />
                            </div>

                            <div className="w-full md:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                                    Product Details
                                </div>
                                
                                <h2 className="text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">{selectedProduct.name}</h2>
                                
                                <p className="text-muted font-bold text-lg leading-relaxed mb-10">
                                    {selectedProduct.desc}
                                </p>

                                <div className="flex items-center gap-10 mb-12">
                                    <div className="text-5xl font-black text-white tracking-tighter">
                                        <span className="text-xl font-bold text-muted mr-1">₹</span>
                                        {selectedProduct.price.toLocaleString()}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-emerald-500">
                                            <Star size={18} className="fill-emerald-500" />
                                            <span className="text-lg font-black">{selectedProduct.rating}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">Rating</span>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <button
                                        onClick={() => {
                                            addToCart(selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        className="btn-primary flex-1 !py-6 !text-xs !font-black flex items-center justify-center gap-4 group shadow-emerald-500/20"
                                    >
                                        <ShoppingCart size={20} /> ADD TO CART
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Marketplace;
