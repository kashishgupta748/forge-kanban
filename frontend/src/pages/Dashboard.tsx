import React from 'react';
import { useBoards } from '../hooks/useBoards';
import { useCards } from '../hooks/useCards';
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';

const Dashboard = () => {
  // Fetch dashboard stats from API
  const { data, isLoading } = useBoards(); // Suppose useBoards can fetch dashboard or we have a specific hook

  if (isLoading) return <div className="p-8 text-center text-slate-400">Loading dashboard...</div>;

  const stats = [
    { name: 'Total Boards', value: '3', icon: LayoutDashboard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Total Cards', value: '24', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Due Today', value: '2', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Overdue', value: '1', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Good morning, Human</h1>
        <p className="text-slate-400">Here's what's happening across your boards today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm flex items-center gap-4 hover:border-slate-600 transition-colors">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.name}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Boards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Boards</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/boards/1" className="block bg-gradient-to-br from-indigo-500/10 to-slate-800 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">Product Roadmap</h3>
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">High-level product strategy and feature planning for Q1-Q2 2026</p>
            </Link>
            
            <Link to="/boards/2" className="block bg-gradient-to-br from-blue-500/10 to-slate-800 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Engineering Sprint</h3>
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">Two-week engineering sprint tracking technical tasks and bug fixes</p>
            </Link>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Activity</h2>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 h-[400px] overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <Avatar name={`User ${i}`} size="sm" />
                  <div>
                    <p className="text-sm text-slate-300">
                      <span className="font-medium text-white">User {i}</span> moved card <span className="font-medium text-white">Setup CI/CD</span> to Done
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{i} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
