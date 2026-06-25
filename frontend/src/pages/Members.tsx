import React from 'react';
import { Mail, Shield, Trash2, Plus } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';

const mockMembers = [
  { id: 1, name: 'Alice Engineer', email: 'alice@forge.dev', role: 'admin' },
  { id: 2, name: 'Bob Designer', email: 'bob@forge.dev', role: 'member' },
  { id: 3, name: 'Charlie Product', email: 'charlie@forge.dev', role: 'admin' },
  { id: 4, name: 'Diana Marketing', email: 'diana@forge.dev', role: 'member' },
];

const Members = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Members</h1>
          <p className="text-slate-400 mt-1">Manage team members and roles</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-5 h-5" />
          Add Member
        </Button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-900/20">
              <th className="p-4 text-sm font-semibold text-slate-300">Name</th>
              <th className="p-4 text-sm font-semibold text-slate-300">Email</th>
              <th className="p-4 text-sm font-semibold text-slate-300">Role</th>
              <th className="p-4 text-sm font-semibold text-slate-300 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockMembers.map((member) => (
              <tr key={member.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} />
                    <span className="font-medium text-white">{member.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                    member.role === 'admin' 
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      : 'bg-slate-700/50 text-slate-300 border-slate-600/50'
                  }`}>
                    {member.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </div>
                </td>
                <td className="p-4">
                  <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;
