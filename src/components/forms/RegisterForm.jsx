import React, {useState} from 'react';

function RegisterForm({onSubmit, loading, error, success}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        profile_image: null,
    });

    const handleChange = (e) => {
        const {id, value, files} = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: files ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

            {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 whitespace-pre-wrap">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}

            <input type="text" id="name" placeholder="Name" value={formData.name}
                   onChange={handleChange} required className="border rounded w-full py-2 px-3 mb-3"/>

            <input type="email" id="email" placeholder="Email" value={formData.email}
                   onChange={handleChange} required className="border rounded w-full py-2 px-3 mb-3"/>

            <input type="password" id="password" placeholder="Password" value={formData.password}
                   onChange={handleChange} required className="border rounded w-full py-2 px-3 mb-3"/>

            <input type="password" id="password_confirmation" placeholder="Confirm Password"
                   value={formData.password_confirmation}
                   onChange={handleChange} required className="border rounded w-full py-2 px-3 mb-3"/>

            <input type="file" id="profile_image" accept="image/*" onChange={handleChange} className="mb-6"/>

            <button type="submit" disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full">
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
}

export default RegisterForm;
