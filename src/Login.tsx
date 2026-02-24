import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, UserPlus, X } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
  onClose: () => void;
}

function Login({ onLogin, onClose }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await axios.post('https://roan-ai-backend.onrender.com/api/auth/login', {
          email,
          password
        }, {
          withCredentials: true
        });

        if (response.data.success) {
          onLogin(response.data.user);
          onClose();
        }
      } else {
        // Register
        const response = await axios.post('https://roan-ai-backend.onrender.com/api/auth/register', {
          username,
          email,
          password
        }, {
          withCredentials: true
        });

        if (response.data.success) {
          // Switch to login after successful registration
          setIsLogin(true);
          setError('Registration successful! Please login.');
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
          {isLogin ? 'Login to ROAN AI' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          {error && (
            <div className={`p-3 rounded text-sm ${
              error.includes('successful') 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Login' : 'Register'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="w-full text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;