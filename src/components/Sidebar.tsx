import React from 'react';
import { 
  Inbox, Send, File, Trash2, AlertOctagon, 
  Plus, Star, Tag
} from 'lucide-react';
import type { Label } from '../types/email';

interface SidebarProps {
  currentFolder: string;
  onFolderChange: (folder: string) => void;
  onCompose: () => void;
  labels: Label[];
}

export default function Sidebar({ 
  currentFolder, 
  onFolderChange, 
  onCompose,
  labels = []
}: SidebarProps) {
  const folders = [
    { name: 'inbox', icon: Inbox, label: 'Inbox' },
    { name: 'sent', icon: Send, label: 'Sent' },
    { name: 'drafts', icon: File, label: 'Drafts' },
    { name: 'trash', icon: Trash2, label: 'Trash' },
    { name: 'spam', icon: AlertOctagon, label: 'Spam' }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full border-r dark:border-gray-700">
      <div className="p-4">
        <button 
          onClick={onCompose}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>New Email</span>
        </button>
      </div>

      <nav className="mt-2">
        {folders.map(({ name, icon: Icon, label }) => (
          <button
            key={name}
            onClick={() => onFolderChange(name)}
            className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              currentFolder === name 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-700 dark:text-gray-200'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 px-4">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Labels
        </h2>
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => onFolderChange(`label-${label.id}`)}
            className={`w-full text-left px-4 py-2 flex items-center gap-3 rounded-md ${label.color}`}
          >
            <Tag size={16} />
            <span>{label.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}