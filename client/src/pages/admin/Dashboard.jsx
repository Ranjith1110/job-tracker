import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Target, ArrowUpRight, Building2, Briefcase } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from "../../components/dashboard/Navbar";
import Sidebar from "../../components/dashboard/Sidebar";

const Dashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Real Data States
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_URL;

    // Fetch Real Data from API
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/signin');
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_BASE}/api/applications`, config);

                setApplications(data);
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    navigate('/signin');
                } else {
                    toast.error("Failed to load dashboard data");
                }
                setLoading(false);
            }
        };

        fetchApplications();
    }, [API_BASE, navigate]);

    // --- DATA PROCESSING LOGIC ---

    // 1. Top Stats Calculation
    const totalApps = applications.length;
    const interviews = applications.filter(app => app.status === 'Interview').length;
    const offers = applications.filter(app => app.status === 'Offer').length;
    const pending = applications.filter(app => app.status === 'Applied' || app.status === 'Wishlist').length;

    // 2. Pipeline Donut Chart Data
    const pipelineData = [
        { name: 'Wishlist', value: applications.filter(a => a.status === 'Wishlist').length, color: '#94a3b8' },
        { name: 'Applied', value: applications.filter(a => a.status === 'Applied').length, color: '#3b82f6' },
        { name: 'Interview', value: applications.filter(a => a.status === 'Interview').length, color: '#ff6f00' },
        { name: 'Offer', value: applications.filter(a => a.status === 'Offer').length, color: '#0d5f53' },
        { name: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length, color: '#ef4444' },
    ];

    // 3. Activity Area Chart (Last 6 Months)
    const generateActivityData = () => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const data = [];

        // Generate last 6 months buckets
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            data.push({
                monthIndex: d.getMonth(),
                year: d.getFullYear(),
                name: monthNames[d.getMonth()],
                apps: 0
            });
        }

        // Fill buckets with real data
        applications.forEach(app => {
            // Fallback to createdAt if appliedDate is missing
            const date = new Date(app.appliedDate || app.createdAt);
            const m = date.getMonth();
            const y = date.getFullYear();

            const targetMonth = data.find(item => item.monthIndex === m && item.year === y);
            if (targetMonth) {
                targetMonth.apps += 1;
            }
        });

        return data;
    };

    const activityData = generateActivityData();

    // 4. Recent Applications (Top 4 latest)
    // Since backend returns sorted by newest first, we just slice the first 4
    const recentApplications = applications.slice(0, 4);

    // --- HELPERS ---
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Wishlist': return 'bg-slate-100 text-slate-600';
            case 'Applied': return 'bg-blue-50 text-blue-600 border border-blue-100';
            case 'Interview': return 'bg-[#ff6f00]/10 text-[#ff6f00] border border-[#ff6f00]/20';
            case 'Offer': return 'bg-[#0d5f53]/10 text-[#0d5f53] border border-[#0d5f53]/20';
            case 'Rejected': return 'bg-red-50 text-red-600 border border-red-100';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">{label}</p>
                    <p className="text-[#0d5f53] font-bold text-lg">
                        {payload[0].value} Applications
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-slate-50/50 overflow-hidden items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#0d5f53]/20 border-t-[#0d5f53] rounded-full animate-spin"></div>
                    <span className="text-sm font-bold text-slate-400">Loading Dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Header Section */}
                        <header>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
                            <p className="text-slate-500 mt-1 font-light italic">Welcome back to your career command center.</p>
                        </header>

                        {/* 1. Top Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Applications', val: totalApps, color: '#0d5f53' },
                                { label: 'Interviews', val: interviews, color: '#ff6f00' },
                                { label: 'Offers', val: offers, color: '#0d5f53' },
                                { label: 'Pending', val: pending, color: '#ff6f00' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-12 h-1 rounded-full mb-6" style={{ backgroundColor: stat.color }} />
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-slate-900">{stat.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* 2. Main Analytics Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Activity Area Chart (Takes up 2/3 width on desktop) */}
                            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <Activity className="text-[#0d5f53]" size={20} />
                                            Application Activity
                                        </h3>
                                        <p className="text-slate-400 text-xs mt-1">Applications submitted over the last 6 months</p>
                                    </div>
                                </div>
                                <div className="flex-1 min-h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0d5f53" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#0d5f53" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                            <Area type="monotone" dataKey="apps" stroke="#0d5f53" strokeWidth={4} fillOpacity={1} fill="url(#colorApps)" activeDot={{ r: 6, strokeWidth: 0, fill: '#ff6f00' }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pipeline Donut Chart (Takes up 1/3 width on desktop) */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Target className="text-[#ff6f00]" size={20} />
                                        Pipeline Breakdown
                                    </h3>
                                    <p className="text-slate-400 text-xs mt-1">Current status of all applications</p>
                                </div>
                                <div className="flex-1 min-h-[220px] relative flex justify-center items-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pipelineData.filter(d => d.value > 0)} // Only render segments > 0
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pipelineData.filter(d => d.value > 0).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center Text inside Donut */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-3xl font-black text-slate-900">{totalApps}</span>
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400">Total</span>
                                    </div>
                                </div>
                                {/* Custom Legend */}
                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4">
                                    {pipelineData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-xs font-bold text-slate-600">{item.name} <span className="text-slate-400">({item.value})</span></span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* 3. Recent Applications List Row */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Briefcase className="text-[#0d5f53]" size={20} />
                                        Recent Activity
                                    </h3>
                                </div>
                                <Link to="/job-applications" className="text-sm font-bold text-[#0d5f53] hover:underline">View All</Link>
                            </div>

                            <div className="space-y-4">
                                {recentApplications.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-400 font-bold">No applications found.</p>
                                        <Link to="/add-application" className="text-[#0d5f53] text-sm font-bold hover:underline mt-2 inline-block">Add your first job to see stats!</Link>
                                    </div>
                                ) : (
                                    recentApplications.map((app) => (
                                        <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                                    <Building2 size={20} className="text-slate-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{app.companyName}</h4>
                                                    <p className="text-xs font-medium text-slate-500 mt-0.5">{app.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className="text-xs font-bold text-slate-400">{formatDate(app.appliedDate || app.createdAt)}</span>
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider min-w-[90px] text-center ${getStatusStyle(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Bottom padding spacer */}
                        <div className="h-4"></div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;