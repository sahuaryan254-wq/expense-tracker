import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaFilter, FaSearch, FaTimes, FaCamera, FaMicrophone } from 'react-icons/fa';
import TransactionTable from '../components/TransactionTable';
// import ExportButton from '../components/ExportButton';
import API_URL from '../config/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        search: '',
    });
    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        category: 'Food',
        note: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [editId, setEditId] = useState(null);
    const [ocrLoading, setOcrLoading] = useState(false);

    const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Medicine', 'EMI', 'Others', 'Salary', 'Business'];

    const fetchTransactions = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                params: filters,
            };
            const response = await axios.get(`${API_URL}/transaction`, config);
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching transactions', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // OCR functionality temporarily disabled due to build issues
        alert("OCR feature is currently disabled for maintenance.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            if (editId) {
                await axios.put(`${API_URL}/transaction/${editId}`, formData, config);
            } else {
                await axios.post(`${API_URL}/transaction`, formData, config);
            }

            setShowModal(false);
            setEditId(null);
            setFormData({
                amount: '',
                type: 'expense',
                category: 'Food',
                note: '',
                date: new Date().toISOString().split('T')[0],
            });
            fetchTransactions();
        } catch (error) {
            console.error('Error saving transaction', error);
        }
    };

    const handleEdit = (transaction) => {
        setEditId(transaction._id);
        setFormData({
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            note: transaction.note,
            date: transaction.date.split('T')[0],
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                await axios.delete(`${API_URL}/transaction/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                fetchTransactions();
            } catch (error) {
                console.error('Error deleting transaction', error);
            }
        }
    };

    const [isListening, setIsListening] = useState(false);

    const startVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Voice input is not supported in this browser. Please use Google Chrome or Edge.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log("Voice Transcript:", transcript); // Debugging
            parseVoiceInput(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Voice Error:", event.error);
            setIsListening(false);
            if (event.error === 'no-speech') {
                alert('No speech was detected. Please try again.');
            } else {
                alert('Could not understand voice command. Try saying "300 for Lunch"');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const parseVoiceInput = (text) => {
        // Remove special characters that might confuse parsing
        const cleanText = text.replace(/[^\w\s]/gi, '');

        // Find all numbers in the string
        const numbers = cleanText.match(/(\d+)/g);

        let amount = null;
        if (numbers && numbers.length > 0) {
            // Assume the largest number is likely the amount, or the last one if similar
            // For now, let's take the first one found as it's the most common pattern "500 for food"
            amount = numbers[0];
        }

        if (amount) {
            const remainingText = cleanText.replace(amount, '').replace(/spent|for|on|rupees|rs/g, '').trim();

            // Try to match category
            let matchedCategory = 'Others';
            const lowerCats = categories.map(c => c.toLowerCase());

            // Reverse loop to match multi-word categories if any (though currently single word)
            // Splitting by space and checking each word
            const words = remainingText.split(' ');
            for (const word of words) {
                // Simple fuzzy match: check if category starts with the word or contains it
                const index = lowerCats.findIndex(c => c.includes(word) || word.includes(c));
                if (index !== -1) {
                    matchedCategory = categories[index];
                    break;
                }
            }

            setFormData(prev => ({
                ...prev,
                amount: amount,
                category: matchedCategory,
                note: remainingText || 'Voice Entry', // Default note if empty
                type: 'expense'
            }));

            // Auto open modal
            setEditId(null);
            setShowModal(true);
        } else {
            alert(`Sorry, I didn't catch the amount in: "${text}". Please say the amount clearly, e.g., "500 for Food".`);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pt-6 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Transactions
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-light mt-1">Manage all your financial movements</p>
                </div>
                <div className="flex items-center space-x-3">
                    {/* <ExportButton data={transactions} /> */}
                    <button
                        onClick={startVoiceInput}
                        className={`flex items-center space-x-2 px-5 py-3 rounded-xl border transition-all ${isListening
                            ? 'bg-red-500 text-white animate-pulse border-red-500 shadow-red-500/50 shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-indigo-500 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                    >
                        <FaMicrophone />
                        <span className="hidden md:inline">{isListening ? 'Listening...' : 'Voice Add'}</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditId(null);
                            setFormData({
                                amount: '',
                                type: 'expense',
                                category: 'Food',
                                note: '',
                                date: new Date().toISOString().split('T')[0],
                            });
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center space-x-2 shadow-xl shadow-indigo-500/20 px-5 py-3 text-sm"
                    >
                        <FaPlus />
                        <span>Add New</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 flex flex-wrap gap-4 items-center border border-white/20 shadow-lg">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <FaFilter />
                    <span className="font-medium">Filters</span>
                </div>

                <div className="flex-1 min-w-[200px] relative group">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search by note..."
                        className="input-field pl-12 py-2.5 bg-white/50 dark:bg-black/20"
                    />
                </div>

                <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="input-field w-auto py-2.5 px-4 bg-white/50 dark:bg-black/20 cursor-pointer"
                >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="input-field w-auto py-2.5 px-4 bg-white/50 dark:bg-black/20 cursor-pointer"
                >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden shadow-2xl shadow-indigo-500/5 border border-white/10">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-indigo-200/30 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    </div>
                ) : (
                    <TransactionTable
                        transactions={transactions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="glass-card w-full max-w-md p-8 transform transition-all scale-100 border border-white/20 shadow-2xl relative overflow-hidden">

                        {/* Modal Background Gradient */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="text-2xl font-display font-bold text-gray-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                {editId ? 'Edit Transaction' : 'New Transaction'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-white transition-all duration-200"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="mb-6 relative z-10">
                            <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-indigo-300/50 dark:border-indigo-700/50 rounded-2xl cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 hover:border-indigo-400 transition-all duration-300 group">
                                <div className="flex flex-col items-center space-y-2 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                                        <FaCamera className="text-xl" />
                                    </div>
                                    <span className="font-medium text-sm">{ocrLoading ? 'Scanning...' : 'Scan Bill with AI'}</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={ocrLoading}
                                />
                            </label>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">Transaction Type</label>
                                <div className="flex p-1 bg-gray-100/80 dark:bg-black/40 rounded-xl backdrop-blur-sm">
                                    <label className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg cursor-pointer transition-all duration-300 ${formData.type === 'expense' ? 'bg-white dark:bg-gray-800 shadow-sm text-rose-600 dark:text-rose-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="expense"
                                            checked={formData.type === 'expense'}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <span>Expense</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg cursor-pointer transition-all duration-300 ${formData.type === 'income' ? 'bg-white dark:bg-gray-800 shadow-sm text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="income"
                                            checked={formData.type === 'income'}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <span>Income</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 ml-1">Amount</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium group-focus-within:text-indigo-500 transition-colors">₹</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="input-field pl-14 text-lg font-semibold"
                                        placeholder="0.00"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 ml-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="input-field cursor-pointer"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 ml-1">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="input-field cursor-pointer"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 ml-1">Note</label>
                                <textarea
                                    name="note"
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    className="input-field resize-none min-h-[80px]"
                                    rows="3"
                                    placeholder="Add a description..."
                                ></textarea>
                            </div>

                            <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-gray-200 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary py-3 shadow-lg shadow-indigo-500/30"
                                >
                                    Save Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
