import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailView from './components/EmailView';
import ComposeEmail from './components/ComposeEmail';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import type { Email, EmailFolder, Label, EmailAccount } from './types/email';
import EmailService from './lib/api/email';
import AuthService from './lib/auth';

const authService = new AuthService();

const defaultSettings = {
  signature: '',
  autoResponse: {
    enabled: false,
    message: '',
  },
  vacationMode: {
    enabled: false,
    startDate: '',
    endDate: '',
    message: '',
  },
  accounts: [] as EmailAccount[],
  emailsPerPage: 25,
};

export default function App() {
  const [emailService, setEmailService] = useState<EmailService | null>(null);
  const [currentFolder, setCurrentFolder] = useState<EmailFolder>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  // Theme handling
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('emailToken');
    if (token) {
      authService.verifyToken(token).then(valid => {
        setIsAuthenticated(valid);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Load emails and labels
  useEffect(() => {
    if (isAuthenticated && emailService) {
      loadEmails();
      loadLabels();
    }
  }, [currentFolder, isAuthenticated, emailService]);

  const loadEmails = async () => {
    try {
      if (!emailService) return;
      const fetchedEmails = await emailService.getEmails(currentFolder);
      setEmails(fetchedEmails);
    } catch (error) {
      console.error('Failed to load emails:', error);
    }
  };

  const loadLabels = async () => {
    try {
      if (!emailService) return;
      const fetchedLabels = await emailService.getLabels();
      setLabels(fetchedLabels);
    } catch (error) {
      console.error('Failed to load labels:', error);
    }
  };

  const handleCreateLabel = async (label: Omit<Label, 'id'>) => {
    try {
      if (!emailService) return;
      const newLabel = await emailService.createLabel(label);
      setLabels([...labels, newLabel]);
    } catch (error) {
      console.error('Failed to create label:', error);
    }
  };

  const handleUpdateLabel = async (id: string, updates: Partial<Label>) => {
    try {
      if (!emailService) return;
      await emailService.updateLabel(id, updates);
      setLabels(labels.map(label => 
        label.id === id ? { ...label, ...updates } : label
      ));
    } catch (error) {
      console.error('Failed to update label:', error);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    try {
      if (!emailService) return;
      await emailService.deleteLabel(id);
      setLabels(labels.filter(label => label.id !== id));
      if (currentFolder === `label-${id}`) {
        setCurrentFolder('inbox');
      }
    } catch (error) {
      console.error('Failed to delete label:', error);
    }
  };

  const handleLogin = async (credentials: {
    email: string;
    password: string;
    server: {
      imap: { host: string; port: number; secure: boolean };
      smtp: { host: string; port: number; secure: boolean };
    };
  }) => {
    try {
      const token = await authService.login(credentials);
      localStorage.setItem('emailToken', token);
      
      const service = new EmailService({
        host: credentials.server.imap.host,
        port: credentials.server.imap.port,
        user: credentials.email,
        password: credentials.password,
        tls: credentials.server.imap.secure,
      });
      
      setEmailService(service);
      setUserEmail(credentials.email);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('emailToken');
    setIsAuthenticated(false);
    setEmailService(null);
    setEmails([]);
    setLabels([]);
    setSelectedEmail(null);
    setCurrentFolder('inbox');
    setUserEmail('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        currentFolder={currentFolder}
        onFolderChange={setCurrentFolder}
        onCompose={() => setIsComposing(true)}
        labels={labels}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentFolder={currentFolder}
          userEmail={userEmail}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onSignOut={handleSignOut}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="flex-1 flex overflow-hidden">
          {!selectedEmail ? (
            <EmailList
              emails={emails}
              onEmailSelect={setSelectedEmail}
              onStarEmail={(id) => {
                setEmails(emails.map(email => 
                  email.id === id 
                    ? { ...email, starred: !email.starred }
                    : email
                ));
              }}
            />
          ) : (
            <EmailView
              email={selectedEmail}
              onBack={() => setSelectedEmail(null)}
              onStarEmail={(id) => {
                setEmails(emails.map(email => 
                  email.id === id 
                    ? { ...email, starred: !email.starred }
                    : email
                ));
              }}
              labels={labels}
              onToggleLabel={(emailId, labelId) => {
                setEmails(emails.map(email => 
                  email.id === emailId
                    ? {
                        ...email,
                        labels: email.labels.includes(labelId)
                          ? email.labels.filter(id => id !== labelId)
                          : [...email.labels, labelId]
                      }
                    : email
                ));
              }}
            />
          )}
        </main>
      </div>

      {isComposing && (
        <ComposeEmail
          onClose={() => setIsComposing(false)}
          onSend={async (to, subject, body) => {
            if (!emailService) return;
            await emailService.sendEmail(to, subject, body);
            setIsComposing(false);
            if (currentFolder === 'sent') {
              loadEmails();
            }
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          labels={labels}
          onCreateLabel={handleCreateLabel}
          onUpdateLabel={handleUpdateLabel}
          onDeleteLabel={handleDeleteLabel}
          onSave={(newSettings) => {
            setSettings(newSettings);
            setIsSettingsOpen(false);
          }}
        />
      )}
    </div>
  );
}