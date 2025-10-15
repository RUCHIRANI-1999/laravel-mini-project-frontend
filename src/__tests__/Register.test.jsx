import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/Register';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import api from '../api/api';
import { MessageProvider } from '../context/MessageContext';

const mock = new MockAdapter(api);

describe('Register Page', () => {
    beforeEach(() => mock.reset());

    test('renders and submits registration form successfully', async () => {
        mock.onPost('/register').reply(200, { message: 'Registered successfully!' });

        render(
            <MemoryRouter>
                <MessageProvider>
                    <Register />
                </MessageProvider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(mock.history.post.length).toBe(1);
        });
    });

    test('shows error when registration fails', async () => {
        mock.onPost('/register').reply(400, { message: 'Email already taken' });

        render(
            <MemoryRouter>
                <MessageProvider>
                    <Register />
                </MessageProvider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'taken@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(screen.getByText(/email already taken/i)).toBeInTheDocument();
        });
    });
});
