"use client";

import { FaBrain, FaBookOpen, FaLightbulb, FaClock } from "react-icons/fa";
import Particles from "@tsparticles/react";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  const features = [
    {
      icon: <FaBrain className="text-7xl text-cyan-400 drop-shadow-neon" />,
      title: "AI-Powered Learning",
      description:
        "Get study recommendations tailored to your strengths and weaknesses.",
    },
    {
      icon: <FaBookOpen className="text-7xl text-pink-400 drop-shadow-neon" />,
      title: "Comprehensive Study Materials",
      description:
        "Access a vast collection of resources, including notes, videos, and quizzes.",
    },
    {
      icon: (
        <FaLightbulb className="text-7xl text-yellow-300 drop-shadow-neon" />
      ),
      title: "Personalized Study Plans",
      description:
        "Follow customized plans to improve your efficiency and retention.",
    },
    {
      icon: <FaClock className="text-7xl text-purple-400 drop-shadow-neon" />,
      title: "Progress Tracking",
      description: "Monitor your study progress and get real-time feedback.",
    },
  ];

  return (
    <section id="features" className="relative py-24 bg-black overflow-hidden">
      {/* Neon Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          options={{
            particles: {
              number: {
                value: 120,
                density: { 
                  enable: true, 
                  
                },
              },
              size: { value: 4 },
              move: { enable: true, speed: 1.5, direction: "none" },
              color: { value: "#0ff" },
              links: { enable: true, color: "#0ff", opacity: 0.5 },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
              },
            },
          }}
        />
      </div>

      {/* Animated Wave Background */}
      <div className="absolute inset-0 bg-wave bg-cover bg-center opacity-20 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Glitching Title */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 tracking-wider"
        >
          Key Features
        </motion.h2>

        <p className="text-center text-gray-300 mt-4 text-xl">
          Discover the power of AI-driven learning with these futuristic
          features.
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.07,
                boxShadow: "0px 0px 25px rgba(0, 255, 255, 0.9)",
              }}
              className="glass-card relative bg-opacity-20 p-8 rounded-3xl text-center flex flex-col items-center h-full min-h-[400px] border border-cyan-400/30 hover:shadow-neon transition-all cursor-pointer"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 leading-tight break-words">
                {feature.title}
              </h3>
              <p className="text-gray-300 mt-4 text-lg leading-relaxed tracking-wide flex-grow">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}