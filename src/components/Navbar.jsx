// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useMessage } from '../context/MessageContext'; // Import useMessage

function Navbar() {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const { showMessage } = useMessage(); // Get showMessage function

    useEffect(() => {
        const fetchUser = async () => {
            const authToken = localStorage.getItem('authToken');
            if (authToken && !user) {
                try {
                    const response = await api.get('/user', {
                        headers: { Authorization: `Bearer ${authToken}` }
                    });
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Failed to fetch user in Navbar:', error);
                    showMessage('Session expired or invalid. Please log in.', 'error'); // Show error on failed user fetch
                    logout();
                }
            }
        };
        fetchUser();
    }, [user, setUser, logout, showMessage]); // Add showMessage to dependencies

    const handleLogout = async () => {
        try {
            await api.post('/logout', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            showMessage('Logged out successfully!', 'success'); // Show success message
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            showMessage(error.response?.data?.message || 'Logout failed.', 'error'); // Show error message
            logout(); // Still log out locally for UX
            navigate('/login');
        }
    };

    // ... rest of Navbar component remains the same
    return (
        <nav className="bg-gray-800 p-4 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition duration-300">
                    My App
                </Link>
                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <Link to="/posts" className="hover:text-gray-300 transition duration-300">
                                Posts
                            </Link>
                            <Link to="/profile" className="flex items-center space-x-2 group">
                                <img
                                    src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-blue-400 transition duration-300 object-cover"
                                />
                                <span className="font-medium group-hover:text-gray-300 transition duration-300">
                                    {user.name}
                                </span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300 transition duration-300">
                                Login
                            </Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;