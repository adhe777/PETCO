import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import AIDiagnostic from './pages/AIDiagnostic';
import Marketplace from './pages/Marketplace';
import DoctorBooking from './pages/DoctorBooking';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import MyAppointments from './pages/MyAppointments';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import { Toaster } from 'react-hot-toast';
import './index.css';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) return <Navigate to="/login" />;
    return children;
};

const AdminRoute = ({ children }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || (user.role !== 'admin' && user.role !== 'Administrator')) {
        return <Navigate to="/" />;
    }
    return children;
};

const DoctorRoute = ({ children }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || (user.role !== 'doctor' && user.role !== 'Veterinarian')) {
        return <Navigate to="/" />;
    }
    return children;
};

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="min-h-screen bg-[var(--midnight)]">
            <Toaster position="top-center" toastOptions={{ 
                style: { background: '#111827', color: '#fff', border: '1px solid #374151' },
                duration: 3000 
            }} />
            {!isAuthPage && <Header />}
            <main>{children}</main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    <Route path="/" element={<ProtectedRoute><Hero /></ProtectedRoute>} />
                    <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                    <Route path="/doctor" element={<ProtectedRoute><DoctorBooking /></ProtectedRoute>} />
                    <Route path="/ai-diag" element={<ProtectedRoute><AIDiagnostic /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                    
                    <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/doctor-dashboard" element={<DoctorRoute><DoctorDashboard user={JSON.parse(sessionStorage.getItem('user') || '{}')} handleLogout={() => { sessionStorage.clear(); window.location.href = '/login'; }} /></DoctorRoute>} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
