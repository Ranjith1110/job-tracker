import React from 'react';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-12 h-12">
                {/* Background Ring */}
                <div className="absolute inset-0 border-4 border-[#0d5f53]/10 rounded-full"></div>
                {/* Spinning Ring */}
                <div className="absolute inset-0 border-4 border-[#0d5f53] rounded-full border-t-transparent animate-spin"></div>
            </div>
            {text && <p className="text-sm font-bold text-slate-400 animate-pulse">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50/50">
                {content}
            </div>
        );
    }

    return <div className="flex w-full items-center justify-center py-16">{content}</div>;
};

export default Loader;