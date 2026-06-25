import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlignLeft, MessageSquare, Clock } from 'lucide-react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';

interface Props {
  card: any;
  isOverlay?: boolean;
}

const KanbanCard: React.FC<Props> = ({ card, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: 'Card', card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-slate-900 border border-slate-700/80 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group ${
        isOverlay ? 'shadow-2xl shadow-indigo-500/20 rotate-2 scale-105 border-indigo-500' : ''
      }`}
    >
      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.tags.map((tag: any) => (
            <Badge key={tag.id} color={tag.color}>{tag.name}</Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className="text-slate-200 font-medium text-sm leading-snug mb-3 group-hover:text-indigo-300 transition-colors">
        {card.title}
      </h4>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-slate-500 text-xs">
        <div className="flex items-center gap-3">
          {card.description && (
            <div className="flex items-center hover:text-slate-300 transition-colors" title="This card has a description">
              <AlignLeft className="w-3.5 h-3.5" />
            </div>
          )}
          {card.comments?.length > 0 && (
            <div className="flex items-center gap-1 hover:text-slate-300 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{card.comments.length}</span>
            </div>
          )}
          {card.due_date && (
            <div className="flex items-center gap-1 hover:text-slate-300 transition-colors">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(card.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {/* Members */}
        {card.members && card.members.length > 0 && (
          <div className="flex -space-x-1.5">
            {card.members.map((member: any) => (
              <Avatar key={member.id} name={member.name} size="sm" className="border-slate-900" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
