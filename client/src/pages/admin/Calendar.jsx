import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Briefcase, MapPin, Building2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from "../../components/dashboard/Navbar";
import Sidebar from "../../components/dashboard/Sidebar";
import Loader from "../../components/Loader";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Real Data States
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Calendar Navigation State
    const [currentDate, setCurrentDate] = useState(new Date());

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
                    toast.error("Failed to load calendar data");
                }
                setLoading(false);
            }
        };

        fetchApplications();
    }, [API_BASE, navigate]);

    // --- CALENDAR LOGIC ---
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        const today = new Date();

        // Empty slots before the 1st of the month
        for (let i = 0; i < firstDay; i++) {
            days.push({ date: null, isCurrentMonth: false, isToday: false });
        }

        // Actual days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday =
                i === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            days.push({ date: i, isCurrentMonth: true, isToday });
        }

        // Empty slots after the end of the month to complete the row
        const remainder = days.length % 7;
        if (remainder > 0) {
            for (let i = 0; i < (7 - remainder); i++) {
                days.push({ date: null, isCurrentMonth: false, isToday: false });
            }
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    // Month Navigation Handlers
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    // --- DATA MAPPING HELPERS ---
    const getEventsForDay = (dayDate) => {
        if (!dayDate) return [];
        return applications.filter(app => {
            if (!app.appliedDate) return false;
            const appDate = new Date(app.appliedDate);
            return appDate.getDate() === dayDate &&
                appDate.getMonth() === currentDate.getMonth() &&
                appDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const getEventStyle = (status) => {
        switch (status) {
            case 'Interview': return 'bg-[#ff6f00]/10 text-[#ff6f00] border-[#ff6f00]/20';
            case 'Offer': return 'bg-[#0d5f53]/10 text-[#0d5f53] border-[#0d5f53]/20';
            case 'Applied': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getAgendaIconColor = (status) => {
        switch (status) {
            case 'Interview': return 'bg-[#ff6f00] ring-[#ff6f00]/20';
            case 'Offer': return 'bg-[#0d5f53] ring-[#0d5f53]/20';
            case 'Applied': return 'bg-blue-500 ring-blue-500/20';
            case 'Rejected': return 'bg-red-500 ring-red-500/20';
            default: return 'bg-slate-400 ring-slate-400/20';
        }
    };

    // Generate Agenda: Prioritize Interviews & Offers, fallback to most recent
    const getAgendaItems = () => {
        const priorityApps = applications.filter(app => app.status === 'Interview' || app.status === 'Offer');
        const otherApps = applications.filter(app => app.status !== 'Interview' && app.status !== 'Offer');

        // Take up to 3 priority items, pad with others if needed
        let agenda = [...priorityApps, ...otherApps].slice(0, 3);
        return agenda;
    };

    const agendaItems = getAgendaItems();

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // --- FULL PAGE LOADER ---
    if (loading) {
        return (
            <div className="flex h-screen bg-slate-50/50 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
                    <Loader fullScreen={false} text="Syncing Calendar..." />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden relative">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)} />
            )}

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="max-w-7xl mx-auto">

                        {/* Header & Breadcrumb */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => navigate(-1)} className="p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm text-[#0d5f53] hover:bg-slate-50 hover:border-[#0d5f53]/30 transition-all group" title="Go Back">
                                        <ArrowLeft size={16} className="group-active:-translate-x-1 transition-transform" />
                                    </button>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Schedule</h3>
                                </div>
                                <div className="flex items-center gap-2 ml-1 mt-2">
                                    <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                                        <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-[#0d5f53] transition-colors">
                                            <Home size={12} className="mb-0.5" /> Dashboard
                                        </Link>
                                        <span className="text-slate-300 text-xs">/</span>
                                        <span className="text-[#0d5f53]">Calendar</span>
                                    </nav>
                                </div>
                            </div>

                            <Link to="/add-application" className="flex items-center gap-2 bg-[#0d5f53] text-white px-5 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[#0d5f53]/20">
                                <Plus size={18} /> Add Event
                            </Link>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex flex-col xl:flex-row gap-6 mb-10">

                            {/* Left: Main Calendar Grid */}
                            <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8 overflow-x-auto">

                                {/* Calendar Controls */}
                                <div className="flex items-center justify-between mb-8 min-w-[500px]">
                                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                        <CalendarIcon className="text-[#0d5f53]" size={24} />
                                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-[#0d5f53] hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={goToToday} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                                            Today
                                        </button>
                                        <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-[#0d5f53] hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Days Header */}
                                <div className="grid grid-cols-7 gap-4 mb-4 min-w-[500px]">
                                    {daysOfWeek.map((day) => (
                                        <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-2 md:gap-3 min-w-[500px]">
                                    {calendarDays.map((day, index) => {
                                        const dayEvents = getEventsForDay(day.date);
                                        return (
                                            <div
                                                key={index}
                                                className={`min-h-[100px] md:min-h-[130px] p-2 md:p-3 rounded-2xl border transition-all group flex flex-col ${day.isToday
                                                        ? 'bg-[#0d5f53]/5 border-[#0d5f53]/20 ring-1 ring-[#0d5f53]/20'
                                                        : day.isCurrentMonth
                                                            ? 'bg-slate-50/50 border-slate-100 hover:border-slate-300 hover:shadow-sm'
                                                            : 'bg-transparent border-transparent opacity-40'
                                                    }`}
                                            >
                                                {/* Date Number */}
                                                {day.date && (
                                                    <div className={`text-sm font-bold mb-2 flex items-center justify-center w-7 h-7 rounded-full ${day.isToday ? 'bg-[#0d5f53] text-white shadow-md shadow-[#0d5f53]/30' : 'text-slate-500 group-hover:text-slate-900'
                                                        }`}>
                                                        {day.date}
                                                    </div>
                                                )}

                                                {/* Events List for this day */}
                                                <div className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
                                                    {dayEvents.map(event => (
                                                        <Link
                                                            to="/job-applications"
                                                            key={event._id}
                                                            className={`block px-2 py-1.5 rounded-lg border text-[10px] md:text-xs font-bold truncate hover:opacity-80 transition-opacity ${getEventStyle(event.status)}`}
                                                            title={`${event.status} - ${event.companyName}`}
                                                        >
                                                            {event.status}: {event.companyName}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right: Upcoming Agenda Section */}
                            <div className="w-full xl:w-96 flex flex-col gap-6">
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8 flex-1">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Action Agenda</h3>
                                        <span className="bg-[#0d5f53]/10 text-[#0d5f53] text-xs font-bold px-2.5 py-1 rounded-lg">
                                            {agendaItems.length} Tasks
                                        </span>
                                    </div>

                                    {agendaItems.length === 0 ? (
                                        <div className="text-center py-10">
                                            <CalendarIcon className="mx-auto text-slate-200 mb-3" size={40} />
                                            <p className="text-sm font-bold text-slate-400">No agenda items found.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {agendaItems.map((app, index) => (
                                                <div key={app._id || index} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-[-24px] before:w-[2px] before:bg-slate-100 last:before:hidden group">
                                                    <div className={`absolute left-[3px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm group-hover:scale-125 transition-transform ${getAgendaIconColor(app.status)}`}></div>
                                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all">
                                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${app.status === 'Interview' ? 'text-[#ff6f00]' : app.status === 'Offer' ? 'text-[#0d5f53]' : 'text-slate-500'}`}>
                                                            {formatDate(app.appliedDate)}
                                                        </p>
                                                        <h4 className="font-bold text-slate-900 text-[15px] mb-3">{app.companyName} - {app.status}</h4>
                                                        <div className="flex flex-col gap-2">
                                                            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                                <Briefcase size={14} className="text-slate-400" /> {app.role}
                                                            </span>
                                                            {app.country && (
                                                                <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                                    <MapPin size={14} className="text-slate-400" /> {app.country}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                                <Clock size={14} className="text-slate-400" /> Last Updated: {new Date(app.updatedAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Calendar;