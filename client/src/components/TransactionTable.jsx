import { FaEdit, FaTrash } from 'react-icons/fa';

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">
                        <th className="pb-4 font-semibold pl-6">Date</th>
                        <th className="pb-4 font-semibold">Category</th>
                        <th className="pb-4 font-semibold">Note</th>
                        <th className="pb-4 font-semibold text-right">Amount</th>
                        <th className="pb-4 font-semibold text-right pr-6">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {transactions.map((t) => (
                        <tr key={t._id} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                            <td className="py-4 pl-6 text-gray-600 dark:text-gray-300 font-medium">
                                {new Date(t.date).toLocaleDateString()}
                            </td>
                            <td className="py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                                    }`}>
                                    {t.category}
                                </span>
                            </td>
                            <td className="py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{t.note}</td>
                            <td className={`py-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                }`}>
                                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                            </td>
                            <td className="py-4 text-right pr-6">
                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(t)}
                                        className="p-2 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => onDelete(t._id)}
                                        className="p-2 text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan="5" className="py-12 text-center text-gray-400 dark:text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <p className="text-lg font-medium mb-1">No transactions found</p>
                                    <p className="text-sm">Add a new transaction to get started</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
