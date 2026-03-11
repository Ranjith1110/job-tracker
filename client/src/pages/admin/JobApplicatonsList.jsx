import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ExternalLink, Plus, Briefcase, Edit2, Trash2, X, Eye, MapPin } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from "../../components/dashboard/Navbar";
import Sidebar from "../../components/dashboard/Sidebar";

const JobApplicatonsList = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    
    // Action loading states
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
                    toast.error(error.response?.data?.message || "Failed to fetch applications");
                }
                setLoading(false);
            }
        };
        fetchApplications();
    }, [API_BASE, navigate]);

    const openViewModal = (app) => { setSelectedApp(app); setIsViewModalOpen(true); };
    const openDeleteModal = (app) => { setSelectedApp(app); setIsDeleteModalOpen(true); };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${API_BASE}/api/applications/${selectedApp._id}`, config);
            toast.success("Application deleted", { style: { borderRadius: '15px', background: '#0d5f53', color: '#fff' } });
            setApplications(applications.filter((app) => app._id !== selectedApp._id));
            setIsDeleteModalOpen(false);
            setSelectedApp(null);
        } catch (error) {
            toast.error("Failed to delete application");
        } finally {
            setDeleteLoading(false);
        }
    };

    const openEditModal = (app) => {
        setSelectedApp(app);
        setEditFormData({ ...app, appliedDate: app.appliedDate ? app.appliedDate.substring(0, 10) : '' });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put(`${API_BASE}/api/applications/${selectedApp._id}`, editFormData, config);
            toast.success("Application updated", { style: { borderRadius: '15px', background: '#0d5f53', color: '#fff' } });
            setApplications(applications.map((app) => (app._id === data._id ? data : app)));
            setIsEditModalOpen(false);
            setSelectedApp(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update application");
        } finally {
            setEditLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

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

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden relative">
            {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)} />}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => navigate(-1)} className="p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm text-[#0d5f53] hover:bg-slate-50 hover:border-[#0d5f53]/30 transition-all group" title="Go Back">
                                        <ArrowLeft size={16} className="group-active:-translate-x-1 transition-transform" />
                                    </button>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Job Applications</h3>
                                </div>
                                <div className="flex items-center gap-2 ml-1 mt-2">
                                    <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                                        <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-[#0d5f53] transition-colors"><Home size={12} className="mb-0.5" /> Dashboard</Link>
                                        <span className="text-slate-300 text-xs">/</span>
                                        <span className="text-[#0d5f53]">Applications</span>
                                    </nav>
                                </div>
                            </div>
                            <Link to="/add-application" className="flex items-center gap-2 bg-[#0d5f53] text-white px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#0d5f53]/20">
                                <Plus size={18} /> Add Application
                            </Link>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                                            <th className="px-8 py-6">Company</th>
                                            <th className="px-8 py-6">Role</th>
                                            <th className="px-8 py-6">Status</th>
                                            <th className="px-8 py-6">Date Applied</th>
                                            <th className="px-8 py-6 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            [...Array(5)].map((_, index) => (
                                                <tr key={index} className="animate-pulse border-b border-slate-50">
                                                    <td className="px-8 py-6">
                                                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                                    </td>
                                                    <td className="px-8 py-6"><div className="h-4 bg-slate-200 rounded w-full"></div></td>
                                                    <td className="px-8 py-6"><div className="h-6 bg-slate-200 rounded-full w-24"></div></td>
                                                    <td className="px-8 py-6"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex justify-center gap-2">
                                                            <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                                                            <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                                                            <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                                                            <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : applications.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-16 text-slate-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Briefcase size={48} className="text-slate-200 mb-2" />
                                                        <p className="font-bold text-slate-600 text-lg">No applications found.</p>
                                                        <Link to="/add-application" className="text-[#0d5f53] font-bold hover:underline mt-1">Click here to add your first opportunity.</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            applications.map((app) => (
                                                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <p className="font-bold text-slate-900">{app.companyName}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {app.country && <p className="text-xs text-slate-400 font-medium flex items-center gap-0.5"><MapPin size={10}/> {app.country}</p>}
                                                            {app.industry && app.country && <span className="text-slate-300">•</span>}
                                                            {app.industry && <p className="text-xs text-slate-400 font-medium">{app.industry}</p>}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 font-bold text-slate-700">{app.role}</td>
                                                    <td className="px-8 py-5">
                                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(app.status)}`}>{app.status}</span>
                                                    </td>
                                                    <td className="px-8 py-5 text-sm font-medium text-slate-500">{formatDate(app.appliedDate)}</td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => openViewModal(app)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="View Details"><Eye size={16} /></button>
                                                            {app.jobUrl && (
                                                                <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Job Post"><ExternalLink size={16} /></a>
                                                            )}
                                                            <button onClick={() => openEditModal(app)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit"><Edit2 size={16} /></button>
                                                            <button onClick={() => openDeleteModal(app)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* 1. VIEW MODAL */}
            {isViewModalOpen && selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Briefcase size={20} className="text-[#0d5f53]" />
                                Application Details
                            </h3>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Company</p>
                                    <p className="font-bold text-slate-900 text-lg">{selectedApp.companyName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Role</p>
                                    <p className="font-bold text-slate-900 text-lg">{selectedApp.role}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2">Current Status</p>
                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(selectedApp.status)}`}>
                                        {selectedApp.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Date Applied</p>
                                    <p className="font-bold text-slate-700">{formatDate(selectedApp.appliedDate)}</p>
                                </div>
                                {selectedApp.country && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Country / Location</p>
                                        <p className="font-bold text-slate-700 flex items-center gap-1"><MapPin size={14} className="text-[#0d5f53]"/> {selectedApp.country}</p>
                                    </div>
                                )}
                                {selectedApp.industry && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Industry</p>
                                        <p className="font-bold text-slate-700">{selectedApp.industry}</p>
                                    </div>
                                )}
                                {selectedApp.companyId && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Company ID</p>
                                        <p className="font-bold text-slate-700">{selectedApp.companyId}</p>
                                    </div>
                                )}
                                {selectedApp.websiteUrl && (
                                    <div className="md:col-span-2">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Company Website</p>
                                        <a href={selectedApp.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[#0d5f53] font-bold hover:underline flex items-center gap-1 break-all">
                                            {selectedApp.websiteUrl} <ExternalLink size={14} />
                                        </a>
                                    </div>
                                )}
                                {selectedApp.jobUrl && (
                                    <div className="md:col-span-2">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Job Post URL</p>
                                        <a href={selectedApp.jobUrl} target="_blank" rel="noopener noreferrer" className="text-[#0d5f53] font-bold hover:underline flex items-center gap-1 break-all">
                                            {selectedApp.jobUrl} <ExternalLink size={14} />
                                        </a>
                                    </div>
                                )}
                                {selectedApp.note && (
                                    <div className="md:col-span-2">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2">Additional Notes</p>
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-700 font-medium text-sm whitespace-pre-wrap leading-relaxed">
                                            {selectedApp.note}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button onClick={() => setIsViewModalOpen(false)} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-slate-900/20">
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. DELETE MODAL */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">Delete Application</h3>
                        <p className="text-center text-slate-500 text-sm mb-8">
                            Are you sure you want to delete <strong className="text-slate-800">{selectedApp?.companyName}</strong>?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                            <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                {deleteLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>...</> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">Edit Application</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-all"><X size={20} /></button>
                        </div>
                        <div className="p-6 md:p-8">
                            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Company Name</label>
                                    <input name="companyName" value={editFormData.companyName || ''} onChange={handleEditChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Role</label>
                                    <input name="role" value={editFormData.role || ''} onChange={handleEditChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Status</label>
                                    <select name="status" value={editFormData.status || ''} onChange={handleEditChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all font-bold">
                                        <option value="Wishlist">Wishlist</option>
                                        <option value="Applied">Applied</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Offer">Offer</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Country</label>
                                    <select name="country" value={editFormData.country || ''} onChange={handleEditChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all font-bold text-slate-700">
                                        <option value="" disabled>Select Country</option>
                                        <option value="Remote">Remote</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">Australia</option>
                                        <option value="India">India</option>
                                        <option value="Germany">Germany</option>
                                        <option value="France">France</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Date Applied</label>
                                    <input name="appliedDate" type="date" value={editFormData.appliedDate || ''} onChange={handleEditChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Job URL</label>
                                    <input name="jobUrl" value={editFormData.jobUrl || ''} onChange={handleEditChange} type="url" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Notes</label>
                                    <textarea name="note" value={editFormData.note || ''} onChange={handleEditChange} rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all resize-none"></textarea>
                                </div>
                                <div className="md:col-span-2 mt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                                    <button type="submit" disabled={editLoading} className="px-8 py-3 bg-[#0d5f53] text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#0d5f53]/20 disabled:opacity-70 flex items-center justify-center gap-2">
                                        {editLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApplicatonsList;