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

export default MyLineChart;
