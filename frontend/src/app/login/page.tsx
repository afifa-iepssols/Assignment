'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../components/UserContext'

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://assignment-2-tjzw.onrender.com/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      const userRes = await fetch("https://assignment-2-tjzw.onrender.com/api/auth/me", {
        credentials: "include",
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h1 className="text-2xl font-semibold mb-4 text-center text-neutral-900">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Username */}
        <div>
          <label className="block mb-1 font-medium text-neutral-900">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-neutral-900"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium text-neutral-900">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-neutral-900"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-sky-800 text-white rounded hover:opacity-80 transition-opacity"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Go to Register */}
        <p className="text-center mt-2 text-sm text-neutral-700">
          Don’t have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => router.push('/register')}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
