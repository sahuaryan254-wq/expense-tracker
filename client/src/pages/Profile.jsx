import { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaSave, FaCamera, FaWallet } from 'react-icons/fa';
import API_URL from '../config/api';

const Profile = ({ user, setUser }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        password: '',
        newPassword: '',
        monthlyBudget: user.monthlyBudget || '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password, newPassword, monthlyBudget } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const updateData = { name, email, monthlyBudget };
            if (newPassword) {
                updateData.password = newPassword;
            }

            const response = await axios.put(`${API_URL}/user/update`, updateData, config);

            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            setMessage('Profile updated successfully');
            setError('');
            setFormData(prev => ({ ...prev, password: '', newPassword: '' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="glass-card p-8">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-indigo-600 transition-colors">
                            <FaCamera className="text-sm" />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
                        <p className="text-gray-500 dark:text-gray-400">Manage your account information</p>
                    </div>
                </div>

                {message && (
                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-6 text-sm flex items-center border border-emerald-100">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm flex items-center border border-red-100">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    className="input-field pl-11"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    className="input-field pl-11"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700/50 pt-6 mt-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                            <FaWallet className="mr-2 text-indigo-500" />
                            Financial Settings
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Budget Limit (₹)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-bold">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="monthlyBudget"
                                        value={monthlyBudget}
                                        onChange={onChange}
                                        className="input-field pl-12"
                                        placeholder="Set your monthly limit"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">You'll be alerted if expenses exceed this amount</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700/50 pt-6 mt-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                            <FaLock className="mr-2 text-indigo-500" />
                            Security
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={onChange}
                                        className="input-field pl-11"
                                        placeholder="Leave blank to keep current"
                                        minLength="6"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 ml-1">Minimum 6 characters</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="btn-primary flex items-center space-x-2 px-8"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FaSave />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
