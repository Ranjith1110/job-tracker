import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { LayoutDashboard, Briefcase, Settings, LogOut, Bell } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { name: 'Add New Application', icon: <LayoutDashboard size={20} />, path: '/add-application' },
        { name: 'Job Applications', icon: <Briefcase size={20} />, path: '/job-applications' },
    ];

    const handleLogout = () => {
        // 1. Clear storage
        localStorage.clear();

        // 2. Trigger the Toast
        toast.success('Logged Out Successfully!', {
            style: {
                borderRadius: '15px',
                background: '#0d5f53', // Matching your theme green
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px',
                padding: '16px 24px'
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#0d5f53',
            },
        });

        // 3. Redirect to SignIn
        navigate('/signin');
    };

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="p-8 flex items-center justify-between mb-6">
                <Link to="/dashboard" className="text-3xl font-black tracking-tighter text-[#0d5f53]">
                    JOB<span className="text-[#ff6f00]">TRACKER</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all group ${isActive
                                ? 'bg-[#0d5f53] text-white shadow-lg shadow-[#0d5f53]/20'
                                : 'text-slate-400 hover:bg-slate-50 hover:text-[#0d5f53]'
                                }`}
                        >
                            <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#0d5f53]'}`}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-4 py-4 text-slate-400 font-bold text-sm hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;