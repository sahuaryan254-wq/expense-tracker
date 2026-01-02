import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaWallet, FaUserCircle, FaSignOutAlt, FaChartPie, FaList, FaMoon, FaSun } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed w-full z-50 top-4 px-4">
            <div className="container mx-auto">
                <div className="glass-card flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
                    <Link to="/dashboard" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-xl border border-white/20">
                                <FaWallet className="text-white text-lg" />
                            </div>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 font-display tracking-wide">
                            EXPENSE<span className="font-light text-gray-800 dark:text-white">TRACKER</span>
                        </span>
                    </Link>

                    <div className="flex items-center space-x-1 md:space-x-6">
                        <div className="hidden md:flex items-center space-x-2 bg-gray-100/50 dark:bg-black/20 p-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
                            <Link
                                to="/dashboard"
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive('/dashboard')
                                    ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300'
                                    }`}
                            >
                                <FaChartPie />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/transactions"
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive('/transactions')
                                    ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300'
                                    }`}
                            >
                                <FaList />
                                <span>Transactions</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 pl-4 md:pl-6 md:border-l border-gray-200/50 dark:border-gray-700/50">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                                {darkMode ? <FaSun className="text-yellow-400 text-lg drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> : <FaMoon className="text-indigo-600 text-lg drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]" />}
                            </button>

                            <Link to="/profile" className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                                <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center border border-indigo-200 dark:border-indigo-800 group-hover:border-indigo-500 dark:group-hover:border-indigo-400 transition-colors">
                                    <FaUserCircle className="text-lg text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <span className="font-medium hidden md:block font-sans">{user.name}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                                title="Logout"
                            >
                                <FaSignOutAlt className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
