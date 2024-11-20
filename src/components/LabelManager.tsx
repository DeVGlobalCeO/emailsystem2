import React, { useState } from 'react';
import { Tag, Plus, X, Edit2, Check } from 'lucide-react';
import type { Label } from '../types/email';

interface LabelManagerProps {
  labels: Label[];
  onCreateLabel: (label: Omit<Label, 'id'>) => void;
  onUpdateLabel: (id: string, updates: Partial<Label>) => void;
  onDeleteLabel: (id: string) => void;
}

const LABEL_COLORS = [
  { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-200' },
  { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-200' },
  { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-200' },
  { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-200' },
  { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-200' },
];

export default function LabelManager({ 
  labels, 
  onCreateLabel, 
  onUpdateLabel, 
  onDeleteLabel 
}: LabelManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0]);
  const [editingName, setEditingName] = useState('');

  const handleCreateLabel = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newLabelName.trim()) {
      onCreateLabel({
        name: newLabelName.trim(),
        color: `${selectedColor.bg} ${selectedColor.text}`,
      });
      setNewLabelName('');
      setSelectedColor(LABEL_COLORS[0]);
      setIsCreating(false);
    }
  };

  const handleUpdateLabel = (id: string, newName: string) => {
    if (newName.trim() && newName !== editingName) {
      onUpdateLabel(id, { name: newName.trim() });
    }
    setEditingId(null);
    setEditingName('');
  };

  const startEditing = (label: Label) => {
    setEditingId(label.id);
    setEditingName(label.name);
  };

  return (
    <div className="space-y-4">
      {/* Existing Labels */}
      <div className="space-y-2">
        {labels.map((label) => (
          <div
            key={label.id}
            className="flex items-center justify-between group rounded-md"
          >
            {editingId === label.id ? (
              <form 
                className="flex-1 flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateLabel(label.id, editingName);
                }}
              >
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-green-600 dark:text-green-400"
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditingName('');
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className={`flex items-center gap-2 px-2 py-1 rounded ${label.color}`}>
                  <Tag size={16} />
                  <span>{label.name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                  <button
                    onClick={() => startEditing(label)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteLabel(label.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create New Label */}
      {isCreating ? (
        <form onSubmit={handleCreateLabel} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="Label name"
              className="flex-1 px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              autoFocus
              required
            />
            <button
              type="submit"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-green-600 dark:text-green-400"
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewLabelName('');
                setSelectedColor(LABEL_COLORS[0]);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {LABEL_COLORS.map((color) => (
              <button
                key={color.bg}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full ${color.bg} ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''
                }`}
              />
            ))}
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full text-left px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
        >
          <Plus size={16} />
          <span>Create new label</span>
        </button>
      )}
    </div>
  );
}