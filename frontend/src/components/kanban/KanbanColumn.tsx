import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreHorizontal, Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';

interface Props {
  list: any;
}

const KanbanColumn: React.FC<Props> = ({ list }) => {
  return (
    <div className="shrink-0 w-80 flex flex-col bg-slate-800/40 rounded-xl border border-slate-700/50 max-h-full overflow-hidden">
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-200">{list.title}</h3>
          <span className="bg-slate-700 text-slate-300 text-xs py-0.5 px-2 rounded-full font-medium">
            {list.cards.length}
          </span>
        </div>
        <button className="text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 p-1 rounded transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Cards Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        <SortableContext items={list.cards.map((c: any) => c.id)} strategy={verticalListSortingStrategy}>
          {list.cards.map((card: any) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {/* Column Footer */}
      <div className="p-3 pt-2 shrink-0 border-t border-transparent hover:border-slate-700/50 transition-colors">
        <button className="flex items-center gap-2 w-full text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 py-2 px-3 rounded-lg transition-colors font-medium text-sm">
          <Plus className="w-4 h-4" />
          Add Card
        </button>
      </div>
    </div>
  );
};

export default KanbanColumn;
