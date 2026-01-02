import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = ({ data }) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const chartData = {
        labels: data.map(item => months[item._id - 1]),
        datasets: [
            {
                label: 'Monthly Spending',
                data: data.map(item => item.total),
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        maintainAspectRatio: false,
    };

    return <Line data={chartData} options={options} />;
};

export default LineChart;
