"use client";

import { useState, useEffect } from "react";
import { Line, Pie, Bar, Radar, Doughnut } from "react-chartjs-2";
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
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { clsx } from "clsx";
import Typewriter from "typewriter-effect"; // Importing typewriter-effect

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const ProgressPage = () => {
  const [showMilestone, setShowMilestone] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [userData, setUserData] = useState({
    subjects: ["Math", "English", "Science", "History", "Art", "Coding"],
    completion: [72, 85, 60, 90, 45, 80],
    studyTime: [25, 20, 20, 15, 20],
    weeklyProgress: [72, 75, 80, 85, 90],
    subjectPerformance: [85, 90, 78, 88, 67, 95],
    skillsStrengths: [80, 85, 70, 60, 95],
    goalProgress: 65,
  });

  const quotes = [
    "Success is the sum of small efforts, repeated day in and day out.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Do not wait to strike till the iron is hot, but make it hot by striking.",
    "Your progress is your own, and every step counts.",
    "The key to success is consistency and hard work.",
  ];

  useEffect(() => {
    setMotivation(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text("Learning Progress Report", 20, 20);
    doc.text(`Completion Progress: ${userData.completion.join(", ")}`, 20, 30);
    doc.text(`Study Time Breakdown: ${userData.studyTime.join(", ")}`, 20, 40);
    doc.text(`Weekly Progress: ${userData.weeklyProgress.join(", ")}`, 20, 50);
    doc.save("progress-report.pdf");
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Subject", "Completion (%)", "Study Time (%)"],
      ...userData.subjects.map((subject, index) => [
        subject,
        userData.completion[index],
        userData.studyTime[index],
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "progress-report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={clsx("bg-gray-900 text-white min-h-screen p-8")}>
      {/* Navbar */}
      <nav className="bg-black text-white p-4 shadow-md fixed top-0 left-0 w-full z-10">
        <div className="flex justify-between items-center">
          <a
            href="/"
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Swift Prep
          </a>
          <ul className="flex space-x-6">
            <li>
              <a
                href="https://developer.mozilla.org/en-US/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400"
              >
                READ DOCS
              </a>
            </li>

            <li>
              <a href="/Dashboard" className="hover:text-blue-400">
                DASHBOARD
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <section className="text-center mb-10 mt-24">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-[Poppins] sans-serif"
        >
          <Typewriter
            options={{
              strings: ["YOUR LEARNING PROGRESS"],
              autoStart: true,
              loop: true,
              delay: 100,
            }}
          />
        </motion.h1>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <motion.div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4">Completion Progress</h2>
          <Line
            data={{
              labels: userData.subjects,
              datasets: [
                {
                  label: "Completion (%)",
                  data: userData.completion,
                  borderColor: "rgb(75, 192, 192)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                },
              ],
            }}
          />
        </motion.div>

        <motion.div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4">Study Time Breakdown</h2>
          <Pie
            data={{
              labels: userData.subjects,
              datasets: [
                {
                  label: "Study Time (%)",
                  data: userData.studyTime,
                  backgroundColor: [
                    "#FF6F61",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                  ],
                },
              ],
            }}
          />
        </motion.div>

        <motion.div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
          <Line
            data={{
              labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
              datasets: [
                {
                  label: "Current Week",
                  data: userData.weeklyProgress,
                  borderColor: "rgb(75, 192, 192)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  fill: false,
                },
                {
                  label: "Previous Week",
                  data: [65, 70, 75, 80, 85],
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  fill: false,
                },
              ],
            }}
          />
        </motion.div>

        <motion.div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4">Subject Performance</h2>
          <Bar
            data={{
              labels: userData.subjects,
              datasets: [
                {
                  label: "Subject Performance",
                  data: userData.subjectPerformance,
                  backgroundColor: "#36A2EB",
                },
              ],
            }}
          />
        </motion.div>

        <motion.div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4">Skills Strengths</h2>
          <Radar
            data={{
              labels: userData.subjects,
              datasets: [
                {
                  label: "Skills Strengths",
                  data: userData.skillsStrengths,
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgb(75, 192, 192)",
                },
              ],
            }}
          />
        </motion.div>

        <motion.div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4">Goal Progress</h2>
          <Doughnut
            data={{
              labels: ["Achieved", "Remaining"],
              datasets: [
                {
                  data: [userData.goalProgress, 100 - userData.goalProgress],
                  backgroundColor: ["#4BC0C0", "#FF6F61"],
                },
              ],
            }}
          />
        </motion.div>
      </section>

      <section className="text-center mb-8">
        <p className="text-xl italic">"{motivation}"</p>
      </section>

      <section className="flex justify-center space-x-4">
        <motion.button
          onClick={downloadReport}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Download Progress Report
        </motion.button>
        <motion.button
          onClick={exportToCSV}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Export to CSV
        </motion.button>
      </section>
    </div>
  );
};

export default ProgressPage;
