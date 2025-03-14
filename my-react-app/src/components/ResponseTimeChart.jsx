import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register all necessary chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const userResponseData = {
  labels: ["User A", "User B", "User C", "User D", "User E"],
  datasets: [
    {
      label: "Response Time (ms)",
      data: [210, 320, 180, 500, 280],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderRadius: 6,
    },
  ],
};

const mlProcessingData = {
  labels: ["Run 1", "Run 2", "Run 3", "Run 4", "Run 5"],
  datasets: [
    {
      label: "ML Processing Time (ms)",
      data: [350, 400, 380, 420, 390],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: true,
      tension: 0.3,
    },
  ],
};

const options = {
  responsive: true,
  // ✅ ทำให้กราฟขยายตาม Container
  maintainAspectRatio: false, 
  plugins: {
    legend: { position: "bottom" },
    title: {
      display: true,
      text: "System Performance Metrics",
      font: { size: 18 },
    },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

export default function ResponseTimeChart() {
  return (
    <div className="mt-4 w-full mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* สำหรับ Bar chart */}
      <div className="bg-white p-6 rounded shadow-lg">
        <h3 className="text-lg font-bold mb-2">Response Time ของผู้ใช้</h3>
        {/* ครอบกราฟด้วย Container ที่กำหนดความสูง */}
        <div className="relative w-full h-64"> 
          <Bar options={options} data={userResponseData} />
        </div>
      </div>

      {/* สำหรับ Line chart */}
      <div className="bg-white p-6 rounded shadow-lg">
        <h3 className="text-lg font-bold mb-2">เวลาการประมวลผลของโมเดล ML</h3>
        {/* ครอบกราฟด้วย Container ที่กำหนดความสูง */}
        <div className="relative w-full h-64"> 
          <Line options={options} data={mlProcessingData} />
        </div>
      </div>
    </div>
  );
}
