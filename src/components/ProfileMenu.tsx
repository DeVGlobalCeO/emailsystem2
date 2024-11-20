import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  UserCircle, Settings, LogOut, Sun, Moon,
  ChevronDown
} from 'lucide-react';

interface ProfileMenuProps {
  email: string;
  onSignOut: () => void;
  onOpenSettings: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function ProfileMenu({ 
  email, 
  onSignOut, 
  onOpenSettings,
  isDarkMode,
  onToggleTheme
}: ProfileMenuProps) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <UserCircle className="w-8 h-8" />
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium truncate max-w-[200px]">{email}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50">
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onOpenSettings}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onToggleTheme}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  {isDarkMode ? (
                    <Sun className="mr-2 h-5 w-5" />
                  ) : (
                    <Moon className="mr-2 h-5 w-5" />
                  )}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              )}
            </Menu.Item>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onSignOut}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300`}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}