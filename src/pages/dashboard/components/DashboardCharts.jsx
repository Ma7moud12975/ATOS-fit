import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardCharts = () => {
  const chartRef = useRef(null);

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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Weekly Workout Activity',
      },
      tooltip: {
        enabled: true,
      },
    },
    hover: {
      mode: null, // Disable hover mode to prevent any hover scaling
    },
    animation: {
      duration: 1200, // Animate bars on mount
      easing: 'easeOutQuart',
      onProgress: function(animation) {
        // No-op, just for reference
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes',
        },
        grid: {
          color: '#eee',
        },
      },
    },
  };

  // Prevent chart from shrinking on hover by fixing the height
  // and disabling any container hover/scale effects
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm h-64 min-h-64 max-h-96 flex flex-col justify-center">
      <Bar ref={chartRef} data={weeklyActivityData} options={options} />
    </div>
  );
};

export default DashboardCharts;
