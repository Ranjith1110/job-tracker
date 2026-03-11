import React from 'react';
import { Menu, Search, User } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
            {/* Mobile Logo & Toggle */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick} // 👈 This triggers the sidebar open
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
                >
                    <Menu size={24} />
                </button>
                <span className="text-xl font-black text-[#0d5f53] lg:hidden">
                    J<span className="text-[#ff6f00]">T.</span>
                </span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] leading-none mb-1">
                        {user?.name || 'Elite User'}
                    </p>
                    <p className="text-[9px] text-[#ff6f00] font-bold uppercase tracking-widest">Premium Member</p>
                </div>
                <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white overflow-hidden">
                    <User size={20} className="text-white/80" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;