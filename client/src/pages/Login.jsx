import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaWallet, FaEnvelope, FaLock } from 'react-icons/fa';
import API_URL from '../config/api';

const Login = ({ setUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: formData.email,
                password: formData.password
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            navigate('/dashboard');
        } catch (err) {
            if (!err.response) {
                setError('Unable to connect to server. Please check your internet connection or try again later.');
            } else {
                setError(err.response?.data?.message || 'Invalid email or password');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-md w-full glass-card p-8 z-10 mx-4 relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-xl border-4 border-white/10">
                    <FaWallet className="text-3xl text-white" />
                </div>

                <h2 className="text-4xl font-display font-bold text-center mb-2 mt-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-light">
                    Access your ultra-secure finance dashboard
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm backdrop-blur-sm animate-fade-in flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <button
                        type="submit"
                        className="w-full btn-primary py-3.5 text-lg shadow-xl"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
