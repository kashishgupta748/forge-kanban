import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, Plus, MoreHorizontal } from 'lucide-react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from '../components/kanban/KanbanColumn';
import KanbanCard from '../components/kanban/KanbanCard';
import Button from '../components/ui/Button';

// Mock data
const initialLists = [
  { id: 'list-1', title: 'To Do', cards: [{ id: 'card-1', title: 'Setup UI', tags: [], members: [] }] },
  { id: 'list-2', title: 'In Progress', cards: [{ id: 'card-2', title: 'API Integration', tags: [], members: [] }] },
  { id: 'list-3', title: 'Done', cards: [] },
];

const BoardView = () => {
  const { id } = useParams();
  const [lists, setLists] = useState(initialLists);
  const [activeCard, setActiveCard] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const cardId = active.id;
    // Find card
    for (const list of lists) {
      const card = list.cards.find(c => c.id === cardId);
      if (card) {
        setActiveCard(card);
        return;
      }
    }
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    
    // Very simplified drag and drop logic for demo purposes
    // Full production would handle different lists vs same list properly
  };

  const handleDragEnd = (event: any) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    // Actual API move would happen here
  };

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Product Roadmap</h1>
          <button className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
            {/* Avatars */}
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-white z-20">AL</div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-white z-10">BO</div>
          </div>
          <Button variant="secondary" className="gap-2">
            <Plus className="w-4 h-4" />
            Invite
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-4">
        <div className="flex items-start gap-6 h-full p-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {lists.map((list) => (
              <KanbanColumn key={list.id} list={list} />
            ))}
            
            <DragOverlay>
              {activeCard ? <KanbanCard card={activeCard} isOverlay /> : null}
            </DragOverlay>
          </DndContext>

          {/* Add List Button */}
          <button className="shrink-0 w-80 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 border-dashed rounded-xl p-4 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add another list</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
