import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, Shield, Package, ShoppingCart, Activity,
    TrendingUp, CheckCircle, AlertCircle, ArrowRight, X, UserCheck, UserX,
    Search, Filter, ChevronRight, MessageSquare, MoreVertical, Plus, Edit, Trash2, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [stats, setStats] = useState({ users: 0, doctors: 0, products: 0, orders: 0 });
    const [doctors, setDoctors] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const token = sessionStorage.getItem('token');
    const adminUser = JSON.parse(sessionStorage.getItem('user') || '{}');

    useEffect(() => {
        if (token) {
            fetchData();
        } else {
            setLoading(false);
            toast.error('Session expired. Please log in again.');
        }
    }, [token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, doctorsRes, usersRes, productsRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/admin/doctors`, { headers: { Authorization: `Bearer ${token}` } }), // Will implement alias in backend or reuse auth logic
                axios.get(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/products`)
            ]);
            setStats(statsRes.data);
            // Assuming '/api/admin/users' fetches all users, let's filter doctors here if API doesn't split
            const allUsers = usersRes.data || [];
            if(doctorsRes) {} // We'll just filter from allUsers instead if we didn't implement '/doctors' route precisely
            setDoctors(allUsers.filter(u => u.role === 'doctor' || u.role === 'Veterinarian'));
            setUsers(allUsers.filter(u => u.role === 'user' || u.role === 'Pet Parent'));
            setProducts(productsRes.data || []);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
            // Fallback for missing routes
            if(err.response?.status === 404) {
               await fallbackFetch();
            } else {
               toast.error('Failed to load dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

    const fallbackFetch = async () => {
        try {
            const [statsRes, usersRes, productsRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/products`)
            ]);
            setStats(statsRes.data);
            const allUsers = usersRes.data || [];
            setDoctors(allUsers.filter(u => u.role === 'doctor' || u.role === 'Veterinarian'));
            setUsers(allUsers.filter(u => u.role === 'user' || u.role === 'Pet Parent'));
            setProducts(productsRes.data || []);
        } catch(e) { console.error('Fallback fetch failed', e); }
    }

    const handleDoctorAction = async (id, action) => {
        try {
            await axios.put(`${API_URL}/api/admin/approve-doctor/${id}`, { action }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Doctor ${action}d successfully`);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action} doctor`);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct._id) {
                await axios.put(`${API_URL}/api/products/${currentProduct._id}`, currentProduct, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Product updated');
            } else {
                await axios.post(`${API_URL}/api/products`, currentProduct, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Product added');
            }
            setIsProductModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error('Failed to save product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`${API_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Product deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete product');
        }
    };

    const tabs = [
        { id: 'Overview', icon: LayoutDashboard },
        { id: 'Doctors', icon: Shield },
        { id: 'Users', icon: Users },
        { id: 'Products', icon: Package },
        { id: 'Orders', icon: ShoppingCart },
    ];

    return (
        <div className="flex flex-col lg:flex-row min-h-[90vh] bg-midnight pt-20">
            {/* Sidebar */}
            <div className="w-full lg:w-72 glass-premium border-r border-white/5 p-6 space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl whitespace-nowrap lg:whitespace-normal font-black text-[10px] uppercase tracking-[0.3em] transition-all flex-shrink-0 ${
                            activeTab === tab.id 
                            ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                            : 'text-muted hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.id}
                    </button>
                ))}
                
                <div className="flex-1 lg:block hidden"></div>
                
                <button
                    onClick={() => { sessionStorage.clear(); window.location.href = '/login'; }}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 font-black text-[10px] uppercase tracking-[0.3em] transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 lg:p-12 space-y-12 h-screen overflow-y-auto custom-scrollbar">
                
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-premium border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                            <Shield size={12} /> System Admin
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                            Admin <span className="text-emerald-500">Dashboard.</span>
                        </h1>
                    </div>
                </div>

                {/* Content switching */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-white/20 border-t-emerald-500 rounded-full animate-spin" /></div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === 'Overview' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Total Users', value: stats.users, icon: Users, color: 'cyan' },
                                        { label: 'Veterinarians', value: stats.doctors, icon: Shield, color: 'emerald' },
                                        { label: 'Products', value: stats.products, icon: Package, color: 'blue' },
                                        { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'indigo' },
                                    ].map((stat, i) => (
                                        <div key={i} className="glass-premium border-white/5 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-all group">
                                            <div className="p-4 bg-white/5 rounded-2xl w-fit text-white mb-6 group-hover:bg-emerald-500 group-hover:scale-110 transition-all">
                                                <stat.icon size={24} />
                                            </div>
                                            <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
                                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* DOCTORS TAB */}
                            {activeTab === 'Doctors' && (
                                <div className="glass-premium border-white/5 rounded-[2rem] overflow-hidden">
                                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                        <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                                            <Shield className="text-emerald-500" size={20} /> Doctor Approvals
                                        </h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-white/[0.01]">
                                                <tr>
                                                    <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">Doctor Details</th>
                                                    <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">Specialization</th>
                                                    <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">License</th>
                                                    <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-muted">Status</th>
                                                    <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-muted">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {doctors.map(doc => (
                                                    <tr key={doc._id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center font-black text-white">
                                                                    {doc.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-white text-sm">{doc.name}</p>
                                                                    <p className="text-[10px] text-muted tracking-widest">{doc.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-sm font-bold text-emerald-100/70">{doc.specialization || 'Not specified'}</td>
                                                        <td className="px-8 py-6 text-xs font-black tracking-widest text-cyan-400">{doc.eligibilityInfo?.licenseNumber || 'PENDING'}</td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${doc.isApproved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                                {doc.isApproved ? 'Approved' : 'Pending Review'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            {!doc.isApproved && (
                                                                <div className="flex items-center justify-end gap-3">
                                                                    <button onClick={() => handleDoctorAction(doc._id, 'approve')} className="p-3 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-500 rounded-xl transition-all">
                                                                        <CheckCircle size={18} />
                                                                    </button>
                                                                    <button onClick={() => handleDoctorAction(doc._id, 'reject')} className="p-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all">
                                                                        <X size={18} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {doc.isApproved && (
                                                                <button onClick={() => handleDoctorAction(doc._id, 'reject')} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-red-500 transition-colors">
                                                                    Revoke
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {doctors.length === 0 && (
                                                    <tr><td colSpan="5" className="p-12 text-center text-muted text-[10px] font-black uppercase tracking-[0.4em]">No doctors found</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* PRODUCTS TAB */}
                            {activeTab === 'Products' && (
                                <div className="space-y-6">
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => { setCurrentProduct({ name: '', price: '', category: 'food', description: '', image: '', stock: 0 }); setIsProductModalOpen(true); }}
                                            className="bg-emerald-500 text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-transform active:scale-95"
                                        >
                                            <Plus size={16} /> Add Product
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {products.map(prod => (
                                            <div key={prod._id} className="glass-premium border-white/5 rounded-[2rem] p-6 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                                                <div>
                                                    <div className="aspect-video w-full rounded-2xl bg-white/5 flex items-center justify-center mb-6 overflow-hidden">
                                                        {prod.image ? <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" /> : <Package size={40} className="text-white/20" />}
                                                    </div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-lg font-black text-white">{prod.name}</h3>
                                                        <span className="text-emerald-400 font-bold">₹{prod.price}</span>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">{prod.category}</p>
                                                    <p className="text-sm text-emerald-100/60 line-clamp-2 mb-6">{prod.description}</p>
                                                </div>
                                                <div className="flex gap-3 pt-6 border-t border-white/5">
                                                    <button onClick={() => { setCurrentProduct(prod); setIsProductModalOpen(true); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all flex justify-center items-center gap-2">
                                                        <Edit size={14} /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(prod._id)} className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2">
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* PRODUCT MODAL */}
            <AnimatePresence>
                {isProductModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-premium border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="text-xl font-black text-white">{currentProduct?._id ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={() => setIsProductModalOpen(false)} className="text-muted hover:text-white"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Product Name</label>
                                    <input type="text" value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="glass-input" required />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Price (₹)</label>
                                        <input type="number" value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} className="glass-input" required />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Category</label>
                                        <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} className="glass-input appearance-none">
                                            <option value="food">Food</option>
                                            <option value="toys">Toys</option>
                                            <option value="health">Health</option>
                                            <option value="accessories">Accessories</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Description</label>
                                    <textarea value={currentProduct.description} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="glass-input h-24 py-4" required></textarea>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Image URL</label>
                                    <input type="text" value={currentProduct.image} onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})} className="glass-input" placeholder="https://..." />
                                </div>
                                <button type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] mt-6 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                                    {currentProduct?._id ? 'Update Product' : 'Create Product'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;
