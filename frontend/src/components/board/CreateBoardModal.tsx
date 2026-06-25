import React from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

const CreateBoardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = React.useState(colors[0]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Board">
      <div className="space-y-6">
        <Input label="Board Name" placeholder="e.g. Engineering Sprint" autoFocus />
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (Optional)</label>
          <textarea 
            className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-4 transition-all resize-none"
            rows={3}
            placeholder="What is this board for?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Board Color</label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full focus:outline-none transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button>Create Board</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateBoardModal;
