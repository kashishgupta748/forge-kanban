import React from 'react';
import { Clock, AlignLeft, MessageSquare, Activity, User, Tag as TagIcon, X, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

interface Props {
  card: any;
  isOpen: boolean;
  onClose: () => void;
}

const CardModal: React.FC<Props> = ({ card, isOpen, onClose }) => {
  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content (Left) */}
        <div className="flex-1 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{card.title}</h2>
            </div>
            <p className="text-sm text-slate-400">
              in list <span className="underline decoration-slate-600 underline-offset-2 font-medium text-slate-300">In Progress</span>
            </p>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap gap-6">
            {/* Members */}
            {card.members && card.members.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Members</h3>
                <div className="flex -space-x-1">
                  {card.members.map((m: any) => (
                    <Avatar key={m.id} name={m.name} size="md" className="border-slate-800" />
                  ))}
                  <button className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 border-2 border-slate-800 flex items-center justify-center text-slate-300 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag: any) => (
                    <Badge key={tag.id} color={tag.color}>{tag.name}</Badge>
                  ))}
                  <button className="h-6 px-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Due Date */}
            {card.due_date && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Due Date</h3>
                <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded px-2 py-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-200">
                    {new Date(card.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlignLeft className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-semibold text-white">Description</h3>
            </div>
            {card.description ? (
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none">
                {card.description}
              </div>
            ) : (
              <button className="w-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 text-left p-4 rounded-xl transition-colors border border-transparent hover:border-slate-600/50">
                Add a more detailed description...
              </button>
            )}
          </div>

          {/* Activity / Comments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-white">Activity</h3>
              </div>
            </div>

            <div className="space-y-4">
              {/* Comment Input */}
              <div className="flex gap-3">
                <Avatar name="Current User" size="md" />
                <div className="flex-1 bg-slate-800 border border-slate-700 focus-within:border-indigo-500 rounded-xl overflow-hidden transition-colors">
                  <textarea 
                    className="w-full bg-transparent p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none resize-none"
                    placeholder="Write a comment..."
                    rows={2}
                  />
                  <div className="flex justify-end p-2 bg-slate-800/50 border-t border-slate-700/50">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </div>

              {/* Feed */}
              {card.comments?.map((comment: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <Avatar name={comment.member?.name || 'Unknown'} size="md" />
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-slate-200 text-sm">{comment.member?.name}</span>
                      <span className="text-xs text-slate-500">2 hours ago</span>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl rounded-tl-none text-sm text-slate-300 shadow-sm">
                      {comment.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions (Right) */}
        <div className="md:w-48 space-y-6 shrink-0">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Add to card</h4>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start gap-2" size="sm">
                <User className="w-4 h-4" /> Members
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2" size="sm">
                <TagIcon className="w-4 h-4" /> Tags
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2" size="sm">
                <Clock className="w-4 h-4" /> Dates
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Actions</h4>
            <div className="space-y-2">
              <Button variant="danger" className="w-full justify-start gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20" size="sm">
                <X className="w-4 h-4" /> Archive
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Simple plus icon for internal use in this file
const Plus = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default CardModal;
