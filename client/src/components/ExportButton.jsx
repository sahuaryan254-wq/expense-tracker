import { CSVLink } from 'react-csv';
// Imports moved to dynamic import in function
import { FaFilePdf, FaFileCsv, FaDownload } from 'react-icons/fa';
import { useState } from 'react';

const ExportButton = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);

    const headers = [
        { label: 'Date', key: 'date' },
        { label: 'Type', key: 'type' },
        { label: 'Category', key: 'category' },
        { label: 'Amount', key: 'amount' },
        { label: 'Note', key: 'note' },
    ];

    const csvData = data.map(t => ({
        date: new Date(t.date).toLocaleDateString(),
        type: t.type,
        category: t.category,
        amount: t.amount,
        note: t.note
    }));

    const exportPDF = async () => {
        try {
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text('Transaction Report', 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            const tableColumn = ["Date", "Type", "Category", "Amount", "Note"];
            const tableRows = [];

            data.forEach(t => {
                const transactionData = [
                    new Date(t.date).toLocaleDateString(),
                    t.type,
                    t.category,
                    `Rs. ${t.amount}`,
                    t.note,
                ];
                tableRows.push(transactionData);
            });

            // autoTable is attached to jsPDF prototype usually, 
            // but dynamic import might need manual application or just importing side-effect.
            // jspdf-autotable modifies the jsPDF class.
            // Let's rely on the side-effect import we already have or re-import it.
            // With dynamic import, we might need:
            require('jspdf-autotable'); // This might not work in ESM.

            // Standard jspdf-autotable usage with Vite:
            // import 'jspdf-autotable' usually works if 'jspdf' is working.
            // The issue is likely the 'import jsPDF from jspdf' at top level.

            // Re-attempting top-level import fix based on common issue:
            // It might be import { jsPDF } from 'jspdf';

            // Let's try standard autoTable with the dynamically imported jsPDF
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'grid',
                styles: { fontSize: 10 },
                headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
            });

            doc.save('transactions.pdf');
            setIsOpen(false);
        } catch (error) {
            console.error("PDF Export failed", error);
            alert("Failed to export PDF. Please try again or download CSV.");
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all shadow-sm"
            >
                <FaDownload className="text-indigo-500" />
                <span className="font-medium">Export</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-card border border-white/20 z-50 overflow-hidden animate-fade-in">
                    <button
                        onClick={exportPDF}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-indigo-50/50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors text-left"
                    >
                        <FaFilePdf className="text-red-500" />
                        <span>Export as PDF</span>
                    </button>
                    <CSVLink
                        data={csvData}
                        headers={headers}
                        filename={"transactions.csv"}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-indigo-50/50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors text-left"
                        onClick={() => setIsOpen(false)}
                    >
                        <FaFileCsv className="text-emerald-500" />
                        <span>Export as CSV</span>
                    </CSVLink>
                </div>
            )}
        </div>
    );
};

export default ExportButton;
