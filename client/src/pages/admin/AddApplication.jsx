import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Building2, Globe, Briefcase, Calendar, Link2, FileText, ChevronDown, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from "../../components/dashboard/Navbar";
import Sidebar from "../../components/dashboard/Sidebar";

const AddApplication = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [formData, setFormData] = useState({
        companyName: '',
        websiteUrl: '',
        industry: '',
        companyId: '',
        role: '',
        country: '', // NEW: Country state added
        status: 'Wishlist',
        appliedDate: new Date().toISOString().split('T')[0],
        jobUrl: '',
        note: ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};
        if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required";
        if (!formData.role.trim()) newErrors.role = "Job Role is required";

        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
        if (formData.websiteUrl && !urlPattern.test(formData.websiteUrl)) {
            newErrors.websiteUrl = "Please enter a valid URL";
        }
        if (formData.jobUrl && !urlPattern.test(formData.jobUrl)) {
            newErrors.jobUrl = "Please enter a valid Job URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the highlighted errors");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`${API_BASE}/api/applications`, formData, config);

            toast.success('Application Saved Successfully!', {
                style: { borderRadius: '15px', background: '#0d5f53', color: '#fff' }
            });
            navigate('/job-applications');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden">
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)} />
            )}

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <button onClick={() => navigate(-1)} className="p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm text-[#0d5f53] hover:bg-slate-50 hover:border-[#0d5f53]/30 transition-all group" title="Go Back">
                                    <ArrowLeft size={16} className="group-active:-translate-x-1 transition-transform" />
                                </button>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">New Opportunity</h3>
                            </div>
                            <div className="flex items-center gap-2 ml-1 mt-2">
                                <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                                    <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-[#0d5f53] transition-colors">
                                        <Home size={12} className="mb-0.5" /> Dashboard
                                    </Link>
                                    <span className="text-slate-300 text-xs">/</span>
                                    <span className="text-[#0d5f53]">Add Application</span>
                                </nav>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
                            <div className="p-8 md:p-12">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Company Name *</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" placeholder="e.g. Google"
                                                className={`w-full pl-12 pr-6 py-4 bg-slate-50 border ${errors.companyName ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0d5f53]/10 focus:border-[#0d5f53] outline-none transition-all`} />
                                        </div>
                                        {errors.companyName && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.companyName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Website URL</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} type="text" placeholder="https://company.com"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all" />
                                        </div>
                                        {errors.websiteUrl && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.websiteUrl}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Role / Position *</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input name="role" value={formData.role} onChange={handleChange} type="text" placeholder="e.g. Frontend Developer"
                                                className={`w-full pl-12 pr-6 py-4 bg-slate-50 border ${errors.role ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all`} />
                                        </div>
                                        {errors.role && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.role}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Current Status</label>
                                        <div className="relative">
                                            <select name="status" value={formData.status} onChange={handleChange}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0d5f53] outline-none appearance-none transition-all font-bold text-slate-700">
                                                <option value="Wishlist">Wishlist</option>
                                                <option value="Applied">Applied</option>
                                                <option value="Interview">Interview</option>
                                                <option value="Offer">Offer</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Country / Location</label>
                                        <div className="relative">
                                            <select name="country" value={formData.country} onChange={handleChange}
                                                className="w-full px-6 py-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0d5f53] outline-none appearance-none transition-all font-bold text-slate-700">
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
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Date Applied</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input name="appliedDate" value={formData.appliedDate} onChange={handleChange} type="date"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Industry (Optional)</label>
                                        <input name="industry" value={formData.industry} onChange={handleChange} type="text" placeholder="e.g. Fintech"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Company ID (Optional)</label>
                                        <input name="companyId" value={formData.companyId} onChange={handleChange} type="text" placeholder="e.g. #COMP123"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all" />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Job Post URL</label>
                                        <div className="relative">
                                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input name="jobUrl" value={formData.jobUrl} onChange={handleChange} type="text" placeholder="LinkedIn link"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Additional Notes</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-6 text-slate-400" size={18} />
                                            <textarea name="note" value={formData.note} onChange={handleChange} rows="4" placeholder="Mention requirements..."
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:border-[#0d5f53] outline-none transition-all resize-none"></textarea>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 pt-4">
                                        <button type="submit" disabled={loading}
                                            className="w-full py-5 bg-[#0d5f53] text-white rounded-2xl font-bold shadow-lg shadow-[#0d5f53]/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-3">
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                'Save Application'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddApplication;