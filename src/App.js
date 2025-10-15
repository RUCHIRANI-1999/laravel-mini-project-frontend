// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import UserProfile from './pages/UserProfile'; // Import the new page
import Navbar from './components/Navbar'; // Import the Navbar
import { useAuth } from './context/AuthContext'; // Import useAuth

// A wrapper component for protected routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="text-center mt-10 text-xl text-gray-700">Loading application...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Navbar /> {/* Render Navbar on all pages */}
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                    path="/posts"
                    element={
                        <ProtectedRoute>
                            <Posts />
                        </ProtectedRoute>
                    }
                />
                <Route // New protected route for user profile
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect authenticated users from '/' to '/posts'
                    and unauthenticated users to '/login' */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Navigate to="/posts" replace />
                        </ProtectedRoute>
                    }
                />
                {/*<Route path="/user/:id" element={<UserProfile />} />*/}
                <Route path="*" element={<p className="text-center text-xl mt-10">404 Not Found</p>} />
            </Routes>
        </Router>
    );
}

export default App;