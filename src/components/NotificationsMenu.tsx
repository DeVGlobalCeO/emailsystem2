import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

export default function NotificationsMenu() {
  // Mock notifications - in production, these would come from your backend
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Email',
      message: 'You have received a new email from John Doe',
      time: new Date(),
      read: false,
    },
    {
      id: '2',
      title: 'Storage Alert',
      message: 'Your mailbox is almost full',
      time: new Date(Date.now() - 3600000),
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
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
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2">
            <div className="px-3 py-2 border-b dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            </div>

            <div className="mt-2 space-y-1">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Menu.Item key={notification.id}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        } w-full text-left px-3 py-2 rounded-md`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`text-sm ${!notification.read ? 'font-semibold' : ''} text-gray-900 dark:text-gray-100`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                  No new notifications
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="mt-2 pt-2 border-t dark:border-gray-700">
                <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1">
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}