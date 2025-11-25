
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useContext(AuthContext);

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value });
    // console.log('input change', e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // console.log('handleSubmit called with', form);

    if (!form.username || !form.password) {
      setError('Username and password are required.');
      console.warn('Validation failed: empty fields');
      return;
    }

    try {
      const res = await login(form);
    //   console.log('login result:', res);
      if (res.ok) {
        navigate('/');
      } else {
        console.warn('Login failed response:', res.message);
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('Unexpected error ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Admin Panel Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            id="login-button"
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-2 rounded-lg mt-2 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-xs text-gray-500 mt-4 text-center">
          Use username <span className="font-medium">admin</span> and password <span className="font-medium">admin123</span>.
        </div>
      </div>
    </div>
  );
}
