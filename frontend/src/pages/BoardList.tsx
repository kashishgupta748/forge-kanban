import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutDashboard, MoreVertical } from 'lucide-react';
import Button from '../components/ui/Button';
import CreateBoardModal from '../components/board/CreateBoardModal';

// Mock data to unblock UI while hooking up API
const mockBoards = [
  { id: 1, name: 'Product Roadmap', description: 'High-level product strategy and feature planning', color: '#6366f1', lists_count: 4, cards_count: 12 },
  { id: 2, name: 'Engineering Sprint', description: 'Two-week engineering sprint tracking technical tasks', color: '#0ea5e9', lists_count: 4, cards_count: 8 },
  { id: 3, name: 'Marketing Campaigns', description: 'Campaign planning and launch coordination', color: '#f59e0b', lists_count: 4, cards_count: 5 },
];

const BoardList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Boards</h1>
          <p className="text-slate-400 mt-1">Manage your projects and workflows</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-indigo-500/20">
          <Plus className="w-5 h-5" />
          Create Board
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockBoards.map((board) => (
          <Link 
            key={board.id} 
            to={`/boards/${board.id}`}
            className="group relative bg-slate-800/80 border border-slate-700/80 hover:border-slate-500 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div 
              className="h-2 w-full absolute top-0 left-0"
              style={{ backgroundColor: board.color }}
            />
            <div className="p-6 pt-8">
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10"
                  style={{ backgroundColor: `${board.color}20`, color: board.color }}
                >
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-700" onClick={(e) => e.preventDefault()}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                {board.name}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2 h-10 mb-6">
                {board.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  {board.lists_count} Lists
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  {board.cards_count} Cards
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <CreateBoardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default BoardList;
