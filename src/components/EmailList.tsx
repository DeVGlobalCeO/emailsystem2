import React from 'react';
import { Star, StarOff, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import type { Email } from '../types/email';

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  selectedEmail?: Email;
  onStarEmail: (emailId: string) => void;
}

export default function EmailList({ 
  emails, 
  onEmailSelect, 
  selectedEmail,
  onStarEmail 
}: EmailListProps) {
  return (
    <div className="flex-1 overflow-auto">
      {emails.map((email) => (
        <div
          key={email.id}
          onClick={() => onEmailSelect(email)}
          className={`flex items-center gap-4 p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            selectedEmail?.id === email.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
          } ${!email.read ? 'font-semibold' : ''}`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStarEmail(email.id);
            }}
            className="text-gray-400 hover:text-yellow-400"
          >
            {email.starred ? (
              <Star className="fill-yellow-400 text-yellow-400" size={20} />
            ) : (
              <StarOff size={20} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate">{email.from}</span>
              {'spamScore' in email && email.spamScore > 3 && (
                <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                  <AlertTriangle size={16} />
                  <span className="text-xs">Potential spam</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="truncate text-gray-600 dark:text-gray-400">
                {email.subject}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(email.date), 'MMM d')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}