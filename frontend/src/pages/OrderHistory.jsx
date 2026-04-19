import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle2, XCircle, Truck, AlertTriangle, ChevronDown, ChevronUp, Send, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const statusConfig = {
    Pending:    { color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',   icon: Clock },
    Processing: { color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20',     icon: Package },
    Shipped:    { color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20',     icon: Truck },
    Delivered:  { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
    Cancelled:  { color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',       icon: XCircle },
};

const cancelStatusBadge = {
    Requested: { label: 'Cancellation Pending Review', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    Approved:  { label: 'Cancellation Approved',       color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    Rejected:  { label: 'Cancellation Rejected',       color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const OrderCard = ({ order, onRequestCancel }) => {
    const [expanded, setExpanded] = useState(false);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isSending, setIsSending] = useState(false);

    const status = statusConfig[order.status] || statusConfig.Pending;
    const StatusIcon = status.icon;
    const canRequestCancel = (order.status === 'Pending' || order.status === 'Processing') && order.cancellationStatus === 'None';

    const handleCancelSubmit = async () => {
        if (!cancelReason.trim()) {
            toast.error('Please enter a reason for cancellation');
            return;
        }
        setIsSending(true);
        try {
            await onRequestCancel(order._id, cancelReason);
            setShowCancelForm(false);
            setCancelReason('');
        } finally {
            setIsSending(false);
        }
    };

    const orderId = order._id?.toString().slice(-6).toUpperCase();
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-premium border-white/10 rounded-3xl overflow-hidden"
        >
            {/* Card Header */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl border ${status.bg}`}>
                        <StatusIcon size={20} className={status.color} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <p className="text-sm font-black text-white">Order #{orderId}</p>
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.bg} ${status.color}`}>
                                {order.status}
                            </span>
                            {order.cancellationStatus && order.cancellationStatus !== 'None' && (
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${cancelStatusBadge[order.cancellationStatus]?.color}`}>
                                    {cancelStatusBadge[order.cancellationStatus]?.label}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted mt-1">{orderDate} · {order.products?.length} item(s) · ₹{order.totalAmount?.toFixed(2)}</p>
                        <p className="text-xs text-muted">{order.shippingAddress}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {canRequestCancel && (
                        <button
                            onClick={() => setShowCancelForm(!showCancelForm)}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-500/20 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-all"
                        >
                            Request Cancel
                        </button>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-white transition-all"
                    >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Cancellation Rejection Reason */}
            {order.cancellationStatus === 'Rejected' && order.cancellationRejectionReason && (
                <div className="mx-6 mb-4 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-black text-red-400 mb-1">Admin Rejection Reason</p>
                            <p className="text-xs text-muted">{order.cancellationRejectionReason}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancellation Request Form */}
            <AnimatePresence>
                {showCancelForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mx-6 mb-4"
                    >
                        <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-amber-400" />
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Cancellation Request</p>
                                </div>
                                <button onClick={() => setShowCancelForm(false)} className="text-muted hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>
                            <p className="text-xs text-muted">Please provide a reason for cancelling this order. Admin will review and respond within 24 hours.</p>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="e.g. I ordered the wrong item / Changed my mind / Found it cheaper elsewhere..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-muted resize-none focus:outline-none focus:border-red-500/40 transition-colors"
                                rows={3}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelForm(false)}
                                    className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-muted border border-white/10 rounded-xl hover:bg-white/5 transition-all"
                                >
                                    Nevermind
                                </button>
                                <button
                                    onClick={handleCancelSubmit}
                                    disabled={isSending}
                                    className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={12} /> Submit Request</>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expanded product list */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6"
                    >
                        <div className="border-t border-white/5 pt-5 space-y-3">
                            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-3">Order Items</p>
                            {order.products?.map((item, i) => {
                                const product = item.productId;
                                const name = product?.name || item.name || 'Product';
                                const img = product?.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&auto=format&fit=crop&q=60';
                                return (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-white/3 border border-white/5 rounded-2xl">
                                        <img src={img} alt={name} className="w-14 h-14 object-cover rounded-xl border border-white/10" />
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-white">{name}</p>
                                            <p className="text-xs text-muted">Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</p>
                                        </div>
                                        <p className="text-sm font-black text-emerald-400">₹{(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                );
                            })}
                            <div className="flex justify-between pt-3 border-t border-white/5">
                                <span className="text-xs font-black text-muted uppercase tracking-widest">Total</span>
                                <span className="text-base font-black text-white">₹{order.totalAmount?.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const fetchOrders = async () => {
        if (!user?.id) return;
        try {
            const res = await axios.get(`${API_URL}/api/orders/user/${user.id}`);
            setOrders(res.data || []);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleRequestCancel = async (orderId, reason) => {
        try {
            await axios.patch(`${API_URL}/api/orders/${orderId}/request-cancel`, { reason });
            toast.success('Cancellation request submitted! Admin will review it shortly.');
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not submit request');
            throw err;
        }
    };

    const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="pt-28 min-h-screen bg-midnight pb-20">
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                            <Package className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Order History</h1>
                            <p className="text-muted text-sm font-bold">{orders.length} total orders</p>
                        </div>
                    </div>
                </motion.div>

                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                filter === f
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                                    : 'text-muted border-white/10 bg-white/5 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Orders */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <div className="w-20 h-20 glass-premium border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Package size={36} className="text-muted" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">No orders found</h3>
                        <p className="text-muted">
                            {filter === 'All' ? "You haven't placed any orders yet. Visit the Marketplace to start shopping!" : `No ${filter} orders found.`}
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((order, i) => (
                            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <OrderCard order={order} onRequestCancel={handleRequestCancel} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
