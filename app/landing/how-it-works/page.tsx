"use client";

import { FaUserGraduate, FaRobot, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <FaUserGraduate className="text-6xl text-cyan-400 drop-shadow-lg animate-pulse" />,
      title: "Step 1: Sign Up & Set Goals",
      description: "Create your profile and set your learning preferences.",
    },
    {
      icon: <FaRobot className="text-6xl text-blue-400 drop-shadow-lg animate-pulse" />,
      title: "Step 2: AI-Powered Recommendations",
      description: "Our AI personalizes study materials for you in real time.",
    },
    {
      icon: <FaChartLine className="text-6xl text-purple-400 drop-shadow-lg animate-pulse" />,
      title: "Step 3: Track & Improve",
      description: "Get real-time insights and adjust your learning path.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative min-h-screen flex flex-col items-center justify-center py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-center overflow-hidden"
    >
      {/* 🔷 Background Holographic Grid */}
      <div className="absolute inset-0 z-0 bg-holo-grid opacity-25" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* 🔷 Animated Title */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-widest"
        >
          HOW IT WORKS
        </motion.h2>
        <p className="text-gray-400 mt-4 text-lg">
          A futuristic step-by-step guide to mastering your learning experience.
        </p>

        {/* 🔷 Timeline & Steps Wrapper */}
        <div className="relative mt-16 flex flex-col items-center w-full">
          {/* 🔷 Timeline Vertical Line - Now properly centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 to-transparent"></div>

          {/* 🔷 Step-by-Step Flow */}
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: index * 0.3 }}
              className="relative w-full flex items-center justify-center mb-16"
            >
              {/* 🔷 Timeline Circle */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-cyan-500 rounded-full border-4 border-gray-900"></div>

              {/* 🔷 Step Content */}
              <div
                className={`relative w-full max-w-lg p-8 rounded-xl shadow-lg backdrop-blur-lg border transition-transform duration-300 hover:scale-105 ${
                  index % 2 === 0
                    ? "bg-white/10 border-cyan-500/50 text-left ml-auto"
                    : "bg-gray-800/20 border-blue-500/50 text-right mr-auto"
                }`}
              >
                <div className="flex items-center gap-6">
                  {index % 2 !== 0 && <div className="text-6xl">{step.icon}</div>}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200">{step.title}</h3>
                    <p className="text-gray-400 mt-2">{step.description}</p>
                  </div>
                  {index % 2 === 0 && <div className="text-6xl">{step.icon}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
