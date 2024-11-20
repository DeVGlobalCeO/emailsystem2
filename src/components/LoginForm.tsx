import React, { useState } from 'react';
import { Mail, Lock, Server } from 'lucide-react';

interface LoginFormProps {
  onLogin: (credentials: {
    email: string;
    password: string;
    server: {
      imap: { host: string; port: number; secure: boolean };
      smtp: { host: string; port: number; secure: boolean };
    };
  }) => Promise<void>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [serverConfig, setServerConfig] = useState({
    imap: {
      host: 'mail.cyberpanel.net',
      port: 993,
      secure: true
    },
    smtp: {
      host: 'mail.cyberpanel.net',
      port: 465,
      secure: true
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin({
        email,
        password,
        server: serverConfig
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your email account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                required
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Server className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Server Settings
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h3 className="font-medium text-sm text-gray-700 mb-2">IMAP Settings</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={serverConfig.imap.host}
                      onChange={(e) => setServerConfig(prev => ({
                        ...prev,
                        imap: { ...prev.imap, host: e.target.value }
                      }))}
                      className="px-3 py-1 border rounded"
                      placeholder="IMAP Host"
                    />
                    <input
                      type="number"
                      value={serverConfig.imap.port}
                      onChange={(e) => setServerConfig(prev => ({
                        ...prev,
                        imap: { ...prev.imap, port: parseInt(e.target.value) }
                      }))}
                      className="px-3 py-1 border rounded"
                      placeholder="Port"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-gray-700 mb-2">SMTP Settings</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={serverConfig.smtp.host}
                      onChange={(e) => setServerConfig(prev => ({
                        ...prev,
                        smtp: { ...prev.smtp, host: e.target.value }
                      }))}
                      className="px-3 py-1 border rounded"
                      placeholder="SMTP Host"
                    />
                    <input
                      type="number"
                      value={serverConfig.smtp.port}
                      onChange={(e) => setServerConfig(prev => ({
                        ...prev,
                        smtp: { ...prev.smtp, port: parseInt(e.target.value) }
                      }))}
                      className="px-3 py-1 border rounded"
                      placeholder="Port"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}