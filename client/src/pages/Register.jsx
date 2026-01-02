import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import API_URL from '../config/api';

const Register = ({ setUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }}></div>

            <div className="max-w-md w-full glass-card p-8 z-10 mx-4 relative border-t border-l border-white/20">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 mb-6 transform -rotate-6 transition-transform hover:rotate-0 duration-300">
                        <FaUserPlus className="text-2xl text-white" />
                    </div>
                    <h2 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Join Us
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-light">Start your smart financial journey</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm backdrop-blur-sm animate-fade-in flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Full Name</label>
                        <div className="relative group">
                            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field pl-12"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Email</label>
                        <div className="relative group">
                            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field pl-12"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field pl-12"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Confirm Password</label>
                        <div className="relative group">
                            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-field pl-12"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-3.5 text-lg shadow-xl mt-4"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
