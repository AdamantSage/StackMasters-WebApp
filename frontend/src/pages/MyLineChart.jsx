import React from 'react';
import { Line } from 'react-chartjs-2'; // Import the Line component
import { Chart, registerables } from 'chart.js'; // Import Chart.js

// Register all the necessary components for Chart.js
Chart.register(...registerables);

const MyLineChart = () => {
    // Sample data
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // X-axis labels
        datasets: [
            {
                label: 'Videos Uploaded', // Name of the dataset
                data: [65, 59, 80, 81, 56, 55, 40], // Data points for the Y-axis
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    // Chart options
    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Line Chart Example</h2>
            <Line data={data} options={options} /> {/* Render the Line chart */}
        </div>
    );
};

const LoginTimeChart = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchLoginData = async () => {
            const response = await axios.get('/api/user/login-timings'); // Adjust endpoint accordingly
            const loginTimes = response.data;

            // Prepare data for chart
            const times = Array(24).fill(0); // Count for each hour
            loginTimes.forEach(login => {
                const hour = new Date(login.lastLogin).getHours();
                times[hour] += 1; // Increment count for that hour
            });

            setChartData({
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Labels for hours
                datasets: [
                    {
                        label: 'Number of Logins',
                        data: times,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                ],
            });
        };

        fetchLoginData();
    }, []);

    return (
        <div>
            <h2>Login Times Chart</h2>
            <Bar data={chartData} />
        </div>
    );
};

const ErrorRateGraph = () => {
    const [errorRate, setErrorRate] = useState([]);

    useEffect(() => {
        fetch('/api/error-rate')
            .then((response) => response.json())
            .then((data) => setErrorRate(data))
            .catch((error) => console.error('Error fetching error rate:', error));
    }, []);

    const data = {
        labels: errorRate.map(rate => rate._id),
        datasets: [
            {
                label: 'Error Count',
                data: errorRate.map(rate => rate.count),
                fill: false,
                borderColor: 'red',
            },
        ],
    };

    return <Line data={data} />;
};

export default {MyLineChart, LoginTimeChart, ErrorRateGraph};
