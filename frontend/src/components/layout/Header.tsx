import React from 'react';
import { Search, Bell } from 'lucide-react';
import Avatar from '../ui/Avatar';

const Header = () => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search boards, tasks, or members..." 
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pl-4">
        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-800 mx-2"></div>
        
        <button className="flex items-center gap-2 hover:bg-slate-800 pr-3 pl-1 py-1 rounded-full transition-colors border border-transparent hover:border-slate-700">
          <Avatar name="Human" size="sm" />
          <span className="text-sm font-medium text-slate-300">Human</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
