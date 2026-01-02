import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaWallet, FaChartLine, FaChartPie, FaChartBar } from 'react-icons/fa';
import PieChart from '../components/Charts/PieChart';
import LineChart from '../components/Charts/LineChart';
import BarChart from '../components/Charts/BarChart';
import API_URL from '../config/api';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const response = await axios.get(`${API_URL}/dashboard/summary`, config);
                setData({ ...response.data, budget: user.monthlyBudget || 0 });
            } catch (error) {
                console.error('Error fetching dashboard data', error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pt-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Dashboard Overview
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-light mt-1">Track your financial health in real-time</p>
                </div>
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-white/50 dark:bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/20 shadow-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Budget Alert Section */}
            {data?.budget > 0 ? (
                <div className={`glass-card p-6 border-l-4 ${data.totalExpense > data.budget ? 'border-l-rose-500' : 'border-l-emerald-500'}`}>
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Monthly Budget Status</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {data.totalExpense > data.budget
                                    ? <span className="text-rose-500 font-medium">Over Budget! Control your spending.</span>
                                    : <span className="text-emerald-500 font-medium">You are within your budget. Good job!</span>}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-gray-800 dark:text-white">
                                {Math.min(Math.round((data.totalExpense / data.budget) * 100), 100)}%
                            </span>
                            <span className="text-xs text-gray-500 block">used</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-1000 ${data.totalExpense > data.budget ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`}
                            style={{ width: `${Math.min((data.totalExpense / data.budget) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span>Spent: ₹{data.totalExpense.toLocaleString()}</span>
                        <span>Limit: ₹{parseFloat(data.budget).toLocaleString()}</span>
                    </div>
                </div>
            ) : (
                <div className="glass-card p-6 border-l-4 border-l-indigo-500 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Set a Monthly Budget</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Take control of your finances by setting a spending limit.
                        </p>
                    </div>
                    <a href="/profile" className="btn-primary px-4 py-2 text-sm flex items-center">
                        <FaWallet className="mr-2" />
                        Set Budget
                    </a>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90 transition-opacity group-hover:opacity-100"></div>
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>

                    <div className="relative z-10 text-white">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                                <FaWallet className="text-2xl" />
                            </div>
                            <span className="text-indigo-100 text-xs font-semibold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full border border-white/10">Total Balance</span>
                        </div>
                        <h3 className="text-4xl font-display font-bold mb-2 tracking-tight">₹{data?.balance?.toLocaleString() || 0}</h3>
                        <p className="text-indigo-200 text-sm font-light">Available funds</p>
                    </div>
                </div>

                {/* Income Card */}
                <div className="glass-card p-6 transform hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <FaArrowUp className="text-xl" />
                        </div>
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider">Income</span>
                    </div>
                    <h3 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">₹{data?.totalIncome?.toLocaleString() || 0}</h3>
                    <div className="flex items-center text-emerald-500 text-sm font-medium">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                        Total Earnings
                    </div>
                </div>

                {/* Expense Card */}
                <div className="glass-card p-6 transform hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-rose-100/50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <FaArrowDown className="text-xl" />
                        </div>
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider">Expense</span>
                    </div>
                    <h3 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">₹{data?.totalExpense?.toLocaleString() || 0}</h3>
                    <div className="flex items-center text-rose-500 text-sm font-medium">
                        <span className="w-2 h-2 bg-rose-500 rounded-full mr-2 animate-pulse"></span>
                        Total Spending
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income vs Expense Bar Chart */}
                <div className="glass-card p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700/50 pb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                            <FaChartBar className="mr-3 text-indigo-500" />
                            Income vs Expense
                        </h3>
                    </div>
                    <div className="h-80 w-full">
                        <BarChart income={data?.totalIncome || 0} expense={data?.totalExpense || 0} />
                    </div>
                </div>

                {/* Spending Trend */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700/50 pb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                            <FaChartLine className="mr-3 text-indigo-500" />
                            Monthly Spending Trend
                        </h3>
                    </div>
                    <div className="h-80 w-full">
                        {data?.monthlySpending?.length > 0 ? (
                            <LineChart data={data.monthlySpending} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                                <FaChartLine className="text-5xl mb-4 opacity-20" />
                                <p className="font-light">No spending data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700/50 pb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                            <FaChartPie className="mr-3 text-purple-500" />
                            Expense by Category
                        </h3>
                    </div>
                    <div className="h-80 w-full flex items-center justify-center">
                        {data?.categoryExpense?.length > 0 ? (
                            <PieChart data={data.categoryExpense} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                                <FaChartPie className="text-5xl mb-4 opacity-20" />
                                <p className="font-light">No category data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Transactions</h3>
                    <button className="text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-700/50">
                                <th className="pb-4 pl-4 font-semibold">Date</th>
                                <th className="pb-4 font-semibold">Category</th>
                                <th className="pb-4 font-semibold">Note</th>
                                <th className="pb-4 pr-4 font-semibold text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {data?.recentTransactions?.map((t) => (
                                <tr key={t.id} className="group border-b border-gray-50 dark:border-gray-700/30 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-4 text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                                        {new Date(t.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${t.type === 'income'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                            : 'bg-indigo-50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                                            }`}>
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{t.note}</td>
                                    <td className={`py-4 pr-4 text-right font-bold font-mono ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                        }`}>
                                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500 dark:text-gray-400 font-light">
                                        No recent transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
