import React from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  listName: string;
}

const CreateCardModal: React.FC<Props> = ({ isOpen, onClose, listName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Card to ${listName}`}>
      <div className="space-y-5">
        <Input label="Title" placeholder="What needs to be done?" autoFocus />
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (Optional)</label>
          <textarea 
            className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-4 transition-all resize-none"
            rows={4}
            placeholder="Add more details..."
          />
        </div>

        <Input label="Due Date (Optional)" type="date" />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button>Add Card</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCardModal;
