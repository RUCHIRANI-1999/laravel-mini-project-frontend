// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { useMessage } from '../context/MessageContext'; // Import useMessage

function UserProfile() {
    const { user, setUser } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    // const [message, setMessage] = useState({ type: '', text: '' }); // Remove local message state
    const { showMessage } = useMessage(); // Get showMessage function

    useEffect(() => {
        if (user && user.profile_image_url) {
            setPreviewUrl(user.profile_image_url);
        } else if (user && user.name) {
            setPreviewUrl(`https://ui-avatars.com/api/?name=${user.name}&background=random`);
        }
    }, [user]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            // setMessage({ type: '', text: '' }); // Remove local message clear
        } else {
            setSelectedFile(null);
            setPreviewUrl(user?.profile_image_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`);
        }
    };

    const handleImageUpload = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            showMessage('Please select an image to upload.', 'error'); // Show error
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('profile_image', selectedFile);

        const authToken = localStorage.getItem('authToken');

        try {
            const response = await api.post('/user/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setUser(response.data.user);
            showMessage(response.data.message || 'Profile image updated successfully!', 'success');
            setSelectedFile(null);
        } catch (error) {
            console.error('Profile image upload failed:', error.response?.data || error);
            showMessage(error.response?.data?.message || 'Failed to update profile image.', 'error');
        } finally {
            setUploading(false);
        }
    };

    if (!user) {
        return <div className="text-center mt-10 text-xl text-gray-700">Loading user profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <div className="container mx-auto max-w-lg bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
                <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">User Profile</h1>

                {/*/!* Remove the local message display div *!/*/}
                {/*/!* {message.text && (*/}
                {/*    <div className={`p-4 rounded-md mb-6 text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>*/}
                {/*        {message.text}*/}
                {/*    </div>*/}
                {/*)} *!/*/}

                <div className="flex flex-col items-center mb-8">
                    <img
                        src={previewUrl}
                        alt="Profile Preview"
                        className="w-48 h-48 rounded-full object-cover border-4 border-indigo-400 shadow-md mb-6"
                    />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
                    <p className="text-lg text-gray-600 mb-4">{user.email}</p>
                    <p className="text-md text-gray-500 italic">Member since: {user.created_at}</p>
                </div>

                <form onSubmit={handleImageUpload} className="border-t border-gray-200 pt-8 mt-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Update Profile Image</h3>
                    <div className="mb-6">
                        <label htmlFor="profile_image_input" className="block text-gray-700 text-sm font-bold mb-2">
                            Select New Image:
                        </label>
                        <input
                            type="file"
                            id="profile_image_input"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100 cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={!selectedFile || uploading}
                            className={`py-3 px-8 rounded-full font-bold text-white transition duration-300
                                ${!selectedFile || uploading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserProfile;