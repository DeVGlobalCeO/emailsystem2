import React, { useState } from 'react';
import { ArrowLeft, Star, StarOff, Trash2, Archive, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Email, Label } from '../types/email';

interface EmailViewProps {
  email: Email;
  onBack: () => void;
  onStarEmail: (emailId: string) => void;
  labels: Label[];
  onToggleLabel: (emailId: string, labelId: string) => void;
}

export default function EmailView({ 
  email, 
  onBack, 
  onStarEmail,
  labels,
  onToggleLabel
}: EmailViewProps) {
  const [showLabels, setShowLabels] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
      <div className="border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <div className="p-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {email.subject}
            </h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(email.date), 'PPP p')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onStarEmail(email.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              {email.starred ? (
                <Star className="fill-yellow-400 text-yellow-400" size={20} />
              ) : (
                <StarOff size={20} />
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowLabels(!showLabels)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400"
              >
                <Tag size={20} />
              </button>
              {showLabels && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      onClick={() => onToggleLabel(email.id, label.id)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={email.labels.includes(label.id)}
                        readOnly
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className={`${label.color} px-2 py-1 rounded text-sm`}>
                        {label.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Archive size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {email.from.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {email.from}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                to {email.to}
              </div>
            </div>
          </div>
          {email.labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {email.labels.map(labelId => {
                const label = labels.find(l => l.id === labelId);
                if (!label) return null;
                return (
                  <span
                    key={label.id}
                    className={`${label.color} px-2 py-1 rounded-full text-sm`}
                  >
                    {label.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div 
          className="prose dark:prose-invert max-w-none" 
          dangerouslySetInnerHTML={{ __html: email.body }} 
        />
      </div>
    </div>
  );
}