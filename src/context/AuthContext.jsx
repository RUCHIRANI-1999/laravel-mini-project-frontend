// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/api';

export const AuthContext = createContext(null); // 👈 make sure it's exported

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            try {
                const response = await api.get('/user', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setUser(response.data.user);
            } catch (error) {
                console.error('Auth token invalid or expired:', error);
                localStorage.removeItem('authToken');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback((userData, token) => {
        localStorage.setItem('authToken', token);
        setUser(userData);
        setLoading(false);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setUser(null);
        setLoading(false);
    }, []);

    const contextValue = useMemo(() => ({
        user,
        setUser,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    }), [user, loading, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
