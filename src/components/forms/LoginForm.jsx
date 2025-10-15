import React, { useState } from 'react';

function LoginForm({ onSubmit, loading, error, success }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

            {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email:</label>
                <input type="email" id="email" value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required className="border rounded w-full py-2 px-3" />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password:</label>
                <input type="password" id="password" value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required className="border rounded w-full py-2 px-3" />
            </div>

            <button type="submit" disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full">
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}

export default LoginForm;
