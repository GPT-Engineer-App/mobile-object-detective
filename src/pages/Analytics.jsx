import React from "react";
import { Bar } from "react-chartjs-2";
import { useAnalytics } from "../contexts/AnalyticsContext";

const Analytics = () => {
  const { analyticsData } = useAnalytics();

  const data = {
    labels: analyticsData.map((data, index) => `Detection ${index + 1}`),
    datasets: [
      {
        label: "Detection Scores",
        data: analyticsData.map((data) => data.score),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-4">Analytics</h1>
      <Bar data={data} />
    </div>
  );
};

export default Analytics;