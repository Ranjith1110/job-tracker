import React from 'react'
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-x-hidden">

            {/* --- PREMIUM NAVIGATION --- */}
            <nav className="absolute top-0 w-full z-50 px-4 md:px-8 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl md:text-2xl font-black tracking-tighter text-[#0d5f53]">
                        JOB<span className="text-[#ff6f00]">TRCKER.</span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                        <Link to="/signin" className="text-xs md:text-sm font-bold text-slate-600 hover:text-[#0d5f53] transition-colors cursor-pointer">
                            Sign In
                        </Link>
                        <Link to="/signup" className="px-4 md:px-6 py-2 md:py-2.5 bg-[#0d5f53] text-white text-xs md:text-sm font-bold rounded-full shadow-lg shadow-[#0d5f53]/20 hover:scale-105 transition-all cursor-pointer text-center">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- BACKGROUND ANIMATION (Optimized for Mobile) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] -left-20 w-64 h-64 md:w-[400px] md:h-[400px] bg-[#0d5f53]/5 rounded-full blur-[60px] md:blur-[80px] animate-pulse" />
                <div className="absolute bottom-[5%] -right-20 w-80 h-80 md:w-[500px] md:h-[500px] bg-[#ff6f00]/5 rounded-full blur-[80px] md:blur-[100px] animate-bounce duration-[12s]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 pt-20 pb-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Luxury Badge */}
                    <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-slate-50 border border-slate-100 mb-6 md:mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6f00] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6f00]"></span>
                        </span>
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 italic">
                            Personalized Career Architecture
                        </span>
                    </div>

                    {/* Responsive Premium Headline */}
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] md:leading-[0.95] mb-6 md:mb-8 tracking-tighter">
                        Organize your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d5f53] to-[#0d5f53]/70 italic font-medium pr-1">
                            future.
                        </span>
                    </h1>

                    {/* Responsive Subtext */}
                    <p className="max-w-2xl mx-auto text-slate-500 text-base md:text-2xl mb-10 md:mb-12 leading-relaxed font-light px-2">
                        A minimalist sanctuary for your job search. Track applications
                        with high-fidelity tools built for the modern professional.
                    </p>

                    {/* CTA Group (Mobile: Vertical | Desktop: Horizontal) */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
                        <button className="group relative px-10 md:px-12 py-4 md:py-5 bg-[#0d5f53] text-white rounded-2xl font-bold overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-sm md:text-base">
                            <span className="relative z-10">+ Start Tracking</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </button>
                    </div>

                    {/* Social Proof / Stats (Mobile: 2 cols | Desktop: 3 cols) */}
                    <div className="mt-0 md:mt-10 grid grid-cols-2 md:grid-cols-3 gap-y-8 md:gap-8 items-center border-t border-slate-100 pt-10 md:pt-12">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Security</p>
                            <p className="text-sm md:text-lg font-bold text-[#0d5f53]">Cloud Secured</p>
                        </div>

                        {/* Hidden on very small mobile to keep it clean, shown on md+ */}
                        <div className="hidden md:block text-center">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Architecture</p>
                            <p className="text-lg font-bold text-slate-800 underline decoration-[#ff6f00] decoration-2">MERN Stack</p>
                        </div>

                        <div className="text-center md:text-right">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Tier</p>
                            <p className="text-sm md:text-lg font-bold text-slate-800 italic">Premium Free</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero