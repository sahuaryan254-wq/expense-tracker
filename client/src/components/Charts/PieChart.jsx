import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item._id),
        datasets: [
            {
                data: data.map(item => item.total),
                backgroundColor: [
                    '#4F46E5', // Indigo
                    '#10B981', // Emerald
                    '#F59E0B', // Amber
                    '#EF4444', // Red
                    '#8B5CF6', // Violet
                    '#EC4899', // Pink
                    '#3B82F6', // Blue
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        maintainAspectRatio: false,
    };

    return <Pie data={chartData} options={options} />;
};

export default PieChart;
