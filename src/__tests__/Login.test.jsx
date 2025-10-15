import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import api from '../api/api';
import { AuthProvider } from '../context/AuthContext';
import { MessageProvider } from '../context/MessageContext';

const mock = new MockAdapter(api);

describe('Login Page', () => {
    beforeEach(() => {
        mock.reset();
        localStorage.clear();
    });

    test('renders login form and handles successful login', async () => {
        // Mock API response
        mock.onPost('/login').reply(200, {
            message: 'Login successful',
            access_token: 'fake_token',
            user: { id: 1, name: 'Test User', email: 'test@example.com' }
        });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <MessageProvider>
                        <Login />
                    </MessageProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        // Fill form fields
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mock.history.post.length).toBe(1);
            expect(localStorage.setItem).toBeCalled;
        });
    });

    test('shows error message when login fails', async () => {
        mock.onPost('/login').reply(401, { message: 'Invalid credentials' });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <MessageProvider>
                        <Login />
                    </MessageProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });
});
