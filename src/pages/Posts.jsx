// src/pages/Posts.jsx
import React, {useEffect, useState} from 'react';
import api from '../api/api';
import PostForm from '../components/forms/PostForm';
import {useMessage} from '../context/MessageContext';
// import {Link} from "react-router-dom";
// import UserProfile from "./UserProfile";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [showingPost, setShowingPost] = useState(null);
    const {showMessage} = useMessage();

    const fetchPosts = async () => {
        setLoading(true);
        // setError(''); // Remove local error state
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            showMessage('User not authenticated. Please log in.', 'error'); // Show error
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/posts', {
                headers: {Authorization: `Bearer ${authToken}`}
            });
            setPosts(response.data.data);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
            showMessage(err.response?.data?.message || 'Failed to fetch posts. Please log in again.', 'error'); // Show error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []); // Removed error from dependencies

    const handleCreateNew = () => {
        setEditingPost(null);
        setShowForm(true);
        setShowingPost(null);
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setShowForm(true);
        setShowingPost(null);
    };

    const handleSaveForm = async (formData) => {
        // setError(''); // Remove local error state
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            if (formData.image) {
                data.append('image', formData.image);
            }

            let response;
            if (editingPost) {
                response = await api.post(`/posts/${editingPost.id}?_method=PUT`, data, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
            } else {
                response = await api.post('/posts', data, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
            }

            setShowForm(false);
            setEditingPost(null);
            fetchPosts();
            showMessage(response.data.message || 'Post saved successfully!', 'success'); // Show success
        } catch (err) {
            console.error('Failed to save post:', err.response?.data || err.message);
            showMessage(err.response?.data?.message || 'Failed to save post.', 'error'); // Show error
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingPost(null);
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }
        try {
            const response = await api.delete(`/posts/${postId}`);
            fetchPosts();
            showMessage(response.data.message || 'Post deleted successfully!', 'success'); // Show success
        } catch (err) {
            console.error('Failed to delete post:', err.response?.data || err.message);
            showMessage(err.response?.data?.message || 'Failed to delete post.', 'error'); // Show error
        }
    };

    const handleShowPost = async (postId) => {
        setLoading(true);
        // setError(''); // Remove local error state
        try {
            const response = await api.get(`/posts/${postId}`);
            setShowingPost(response.data.data);
            setShowForm(false);
            setEditingPost(null);
        } catch (err) {
            console.error('Failed to fetch post details:', err.response?.data || err.message);
            showMessage(err.response?.data?.message || 'Failed to fetch post details.', 'error'); // Show error
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowingPost(null);
        setShowForm(false);
        setEditingPost(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900">All Posts</h1>
                    <button
                        onClick={handleCreateNew}
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300"
                    >
                        + Create New Post
                    </button>
                </div>

                {loading &&
                    <div className="text-center text-xl text-gray-700 mt-8 animate-pulse">Fetching posts...</div>}

                {!loading && posts.length === 0 && !showForm && !showingPost && (
                    <div className="text-center text-xl text-gray-700 mt-8 p-6 bg-white rounded-lg shadow-md">
                        No posts found. Be the first to create one! ✨
                    </div>
                )}

                {/* Modal */}
                {(showForm || showingPost) && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl relative">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
                            >
                                &times;
                            </button>

                            {showForm && (
                                <PostForm
                                    currentPost={editingPost}
                                    onSubmit={handleSaveForm}
                                    onCancel={handleCancelForm}
                                />
                            )}

                            {showingPost && (
                                <div className="text-gray-800">
                                    <h3 className="text-3xl font-extrabold mb-3 text-purple-700">{showingPost.title}</h3>
                                    <p className="text-lg mb-6">{showingPost.content}</p>
                                    {showingPost.image_url && (
                                        <img
                                            src={showingPost.image_url}
                                            alt="Post"
                                            className="w-full max-h-96 object-cover rounded mb-4"
                                        />
                                    )}
                                    <div className="border-t pt-4 text-sm text-gray-500 flex justify-between">
                                        <p>By: <span className="font-bold">{showingPost.user.name}</span></p>
                                        <p className="italic">Posted on: {showingPost.created_at}</p>
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button
                                            onClick={handleCloseModal}
                                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Grid */}
                {!loading && posts.length > 0 && !showForm && !showingPost && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <div key={post.id}
                                 className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border hover:shadow-xl transition">
                                <h2 className="text-xl font-extrabold mb-2">{post.user.name.concat(["'s "], [post.title])}</h2>
                                <p className="text-gray-700 mb-4 flex-grow line-clamp-3">{post.content}</p>
                                {post.image_url && (
                                    <img
                                        src={post.image_url}
                                        alt="Post"
                                        className="w-full h-40 object-cover rounded mb-4"
                                    />
                                )}
                                <div className="border-t pt-4 text-sm text-gray-500">
                                    {/*By:*/}
                                    {/*<Link*/}
                                    {/*    to={`/user/${post.user.id}`}*/}
                                    {/*    className="text-indigo-600 hover:underline font-semibold"*/}
                                    {/*>*/}
                                    {/*    {post.user.name}*/}
                                    {/*</Link>*/}
                                    <p>By:
                                        <span className="font-semibold">{post.user.name}</span>
                                    </p>
                                    <p className="italic">Posted on: {post.created_at}</p>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => handleShowPost(post.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-full"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-4 py-2 rounded-full"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-full"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Posts;