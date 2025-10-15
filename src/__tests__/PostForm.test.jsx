// src/__tests__/PostForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostForm from '../components/forms/PostForm';

test('PostForm calls onSubmit with title, content and file', () => {
    const handleSubmit = jest.fn();
    render(<PostForm currentPost={null} onSubmit={handleSubmit} onCancel={() => {}} />);

    // use placeholder queries because component uses placeholders
    const titleInput = screen.getByPlaceholderText(/Title/i);
    const contentInput = screen.getByPlaceholderText(/Content/i);
    // rely on data-testid for file input (see PostForm update below)
    const fileInput = screen.getByTestId('post-image-input');

    fireEvent.change(titleInput, { target: { value: 'My Title' } });
    fireEvent.change(contentInput, { target: { value: 'Body here' } });

    const file = new File(['hello'], 'post.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // click submit button (match either Create Post or Save text)
    fireEvent.click(screen.getByRole('button', { name: /Create Post|Save|Submit/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    const submitted = handleSubmit.mock.calls[0][0];

    // PostForm may call onSubmit with object or FormData — support both:
    if (submitted instanceof FormData) {
        expect(submitted.get('title')).toBe('My Title');
        expect(submitted.get('content')).toBe('Body here');
        expect(submitted.get('image')).toBeTruthy();
    } else {
        expect(submitted.title).toBe('My Title');
        expect(submitted.content).toBe('Body here');
        expect(submitted.image).toBeTruthy();
    }
});
