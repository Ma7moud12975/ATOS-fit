import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardCharts = () => {
  const weeklyActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Workout Duration (minutes)',
        data: [30, 45, 60, 20, 75, 40, 0], // Sample data
        backgroundColor: 'rgba(255, 138, 0, 0.6)',
        borderColor: 'rgba(255, 138, 0, 1)',
        borderWidth: 1,
        borderRadius: 5,
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
        display: true,
        text: 'Your Weekly Workout Activity',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes',
        },
      },
    },
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <Bar data={weeklyActivityData} options={options} />
    </div>
  );
};

export default DashboardCharts;
