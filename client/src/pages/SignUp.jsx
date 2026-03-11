import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/auth/signup`, formData);

      if (response.status === 201 || response.status === 200) {
        toast.success('User Created Successfully!', {
          style: {
            borderRadius: '15px',
            background: '#0d5f53',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '14px'
          },
        });
        navigate('/signin');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", {
        style: { borderRadius: '15px', fontSize: '14px' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0d5f53]/10 rounded-full blur-[120px]" />
      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Full Name</label>
              <input required name="name" onChange={handleChange} type="text" placeholder="John Doe" className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:border-[#0d5f53] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Email Address</label>
              <input required name="email" onChange={handleChange} type="email" placeholder="john@example.com" className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:border-[#0d5f53] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Password</label>
              <input required name="password" onChange={handleChange} type="password" placeholder="••••••••" className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:border-[#0d5f53] outline-none" />
            </div>

            <button disabled={loading} className="w-full py-5 bg-[#0d5f53] text-white rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50">
              {loading ? 'Processing...' : 'Register Now'}
            </button>
          </form>
          <p className="text-center mt-8 text-sm text-slate-400">
            Already have an account? <Link to="/signin" className="text-[#0d5f53] font-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;