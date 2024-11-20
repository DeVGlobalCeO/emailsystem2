import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Calendar } from 'lucide-react';
import type { EmailAccount, Label } from '../types/email';
import LabelManager from './LabelManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    signature: string;
    autoResponse: {
      enabled: boolean;
      message: string;
    };
    vacationMode: {
      enabled: boolean;
      startDate: string;
      endDate: string;
      message: string;
    };
    accounts: EmailAccount[];
    emailsPerPage: number;
  };
  labels: Label[];
  onCreateLabel: (label: Omit<Label, 'id'>) => void;
  onUpdateLabel: (id: string, updates: Partial<Label>) => void;
  onDeleteLabel: (id: string) => void;
  onSave: (settings: any) => void;
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings: initialSettings,
  labels,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
  onSave 
}: SettingsModalProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'labels' | 'accounts'>('general');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    onClose();
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'labels', label: 'Labels' },
    { id: 'accounts', label: 'Accounts' }
  ] as const;

  const updateSettings = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      let current = newSettings;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="border-b dark:border-gray-700">
          <nav className="flex">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 8rem)' }}>
          {activeTab === 'labels' ? (
            <LabelManager
              labels={labels}
              onCreateLabel={onCreateLabel}
              onUpdateLabel={onUpdateLabel}
              onDeleteLabel={onDeleteLabel}
            />
          ) : activeTab === 'accounts' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Email Accounts
                </h3>
                <div className="space-y-4">
                  {settings.accounts.map((account, index) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{account.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{account.name || 'Unnamed Account'}</p>
                      </div>
                      <button
                        onClick={() => {
                          const newAccounts = [...settings.accounts];
                          newAccounts.splice(index, 1);
                          updateSettings(['accounts'], newAccounts);
                        }}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {/* Add account logic */}}
                  className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Plus size={20} />
                  Add another account
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Emails Per Page
                </h3>
                <select
                  value={settings.emailsPerPage}
                  onChange={(e) => updateSettings(['emailsPerPage'], Number(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {[25, 50, 100].map((num) => (
                    <option key={num} value={num}>{num} emails</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Email Signature
                </h3>
                <textarea
                  value={settings.signature}
                  onChange={(e) => updateSettings(['signature'], e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your email signature..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Auto-Response
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoResponse.enabled}
                      onChange={(e) => updateSettings(['autoResponse', 'enabled'], e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <textarea
                  value={settings.autoResponse.message}
                  onChange={(e) => updateSettings(['autoResponse', 'message'], e.target.value)}
                  rows={4}
                  disabled={!settings.autoResponse.enabled}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  placeholder="I'm currently unavailable..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Vacation Mode
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.vacationMode.enabled}
                      onChange={(e) => updateSettings(['vacationMode', 'enabled'], e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={settings.vacationMode.startDate}
                      onChange={(e) => updateSettings(['vacationMode', 'startDate'], e.target.value)}
                      disabled={!settings.vacationMode.enabled}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={settings.vacationMode.endDate}
                      onChange={(e) => updateSettings(['vacationMode', 'endDate'], e.target.value)}
                      disabled={!settings.vacationMode.enabled}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <textarea
                  value={settings.vacationMode.message}
                  onChange={(e) => updateSettings(['vacationMode', 'message'], e.target.value)}
                  rows={4}
                  disabled={!settings.vacationMode.enabled}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  placeholder="I'm on vacation until..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-700 p-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}