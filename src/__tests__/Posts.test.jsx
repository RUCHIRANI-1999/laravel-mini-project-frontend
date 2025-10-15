// src/__tests__/Posts.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MessageProvider } from '../context/MessageContext';
import Posts from '../pages/Posts';
import api from '../api/api';

jest.mock('../api/api');

describe('Posts Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows no posts message when authenticated but empty', async () => {
        localStorage.setItem('authToken', 'dummy-token');
        api.get.mockResolvedValueOnce({ data: { data: [] } });

        render(
            <MessageProvider>
                <Posts />
            </MessageProvider>
        );

        await waitFor(() =>
            expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
        );

        localStorage.removeItem('authToken');
    });

    test('shows login message when unauthenticated', async () => {
        localStorage.removeItem('authToken');
        api.get.mockResolvedValueOnce({ data: { data: [] } });

        render(
            <MessageProvider>
                <Posts />
            </MessageProvider>
        );

        await screen.findByText(/user not authenticated/i);
    });
});
