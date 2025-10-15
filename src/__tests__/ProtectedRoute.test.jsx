// src/__tests__/ProtectedRoute.test.jsx
import React from 'react';
import {render, screen} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

const ProtectedComponent = () => <div>Protected Content</div>;
const Login = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('renders protected content when authenticated', () => {
        render(
            <AuthContext.Provider value={{ token: 'dummy-token' }}>
                <MemoryRouter>
                    <ProtectedRoute>
                        <ProtectedComponent />
                    </ProtectedRoute>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });


    test('redirects to login when unauthenticated', () => {
        render(
            <AuthContext.Provider value={{ token: null }}>
                <MemoryRouter initialEntries={['/protected']}>
                    <ProtectedRoute>
                        <div>Protected Content</div>
                    </ProtectedRoute>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        // Protected content should NOT be in the document
        expect(screen.queryByText(/protected content/i)).toBeNull();
    });


});
