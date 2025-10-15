import React, { useState, useEffect } from 'react';

function PostForm({ currentPost, onSubmit, onCancel, error }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (currentPost) {
            setTitle(currentPost.title);
            setContent(currentPost.content);
        } else {
            setTitle('');
            setContent('');
        }
        setImage(null);
    }, [currentPost]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, content, image });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-extrabold mb-4">{currentPost ? 'Edit Post' : 'Create New Post'}</h3>

            {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</p>}

            <input type="text" placeholder="Title" value={title}
                   onChange={(e) => setTitle(e.target.value)} required
                   className="border rounded w-full py-2 px-3 mb-3" />

            <textarea placeholder="Content" value={content}
                      onChange={(e) => setContent(e.target.value)} rows="5" required
                      className="border rounded w-full py-2 px-3 mb-3" />

            {/* Optional Image Upload */}
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                data-testid="post-image-input"
                className="mb-6"
                />


            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                <button type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    {currentPost ? 'Update Post' : 'Create Post'}
                </button>
            </div>
        </form>
    );
}

export default PostForm;
