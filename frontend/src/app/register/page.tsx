'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState({
    username: '',
    general: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({ username: '', general: '' }); // reset error on typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError({ username: '', general: '' });

    try {
      const res = await fetch('https://assignment-2-tjzw.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message.includes('Username')) {
          setError(prev => ({ ...prev, username: data.message }));
        } else {
          setError(prev => ({ ...prev, general: data.message }));
        }
        setLoading(false);
        return;
      }

      // ✅ Successfully registered — maybe redirect or show success
      alert('Registered successfully!');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(prev => ({ ...prev, general: 'Something went wrong. Please try again.' }));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h1 className="text-2xl font-semibold mb-4 text-center text-neutral-900">Register</h1>
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
          {error.username && (
            <p className="text-sm text-red-500 mt-1">{error.username}</p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium text-neutral-900">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
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

        {/* Role */}
        <div>
          <label className="block mb-1 font-medium text-neutral-900">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded text-neutral-900"
          >
            <option value="User">User</option>
            <option value="Business Owner">Business Owner</option>
          </select>
        </div>

        {/* General Error */}
        {error.general && (
          <p className="text-sm text-red-500 text-center">{error.general}</p>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-sky-800 text-white rounded hover:opacity-80 transition-opacity"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
