import React from 'react';
import { Mail } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import NotificationsMenu from './NotificationsMenu';

interface HeaderProps {
  currentFolder: string;
  userEmail: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
  onOpenSettings: () => void;
}

export default function Header({
  currentFolder,
  userEmail,
  isDarkMode,
  onToggleTheme,
  onSignOut,
  onOpenSettings
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Mail className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {currentFolder.replace('-', ' ')}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <NotificationsMenu />
          <ProfileMenu 
            email={userEmail}
            isDarkMode={isDarkMode}
            onToggleTheme={onToggleTheme}
            onSignOut={onSignOut}
            onOpenSettings={onOpenSettings}
          />
        </div>
      </div>
    </header>
  );
}