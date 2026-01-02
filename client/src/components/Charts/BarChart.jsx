import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ income, expense }) => {
    const data = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                label: 'Amount',
                data: [income, expense],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Green for Income
                    'rgba(255, 99, 132, 0.6)', // Red for Expense
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
                borderRadius: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Income vs Expense',
                color: '#6B7280',
                font: {
                    size: 16,
                    family: "'Inter', sans-serif",
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: '#9CA3AF',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#9CA3AF',
                }
            }
        },
    };

    return <Bar data={data} options={options} />;
};

export default BarChart;
