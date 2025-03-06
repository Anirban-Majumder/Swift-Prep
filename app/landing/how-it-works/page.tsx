"use client";

import { FaUserGraduate, FaRobot, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <FaUserGraduate className="text-5xl text-cyan-400" />,
      title: "STEP 1: SIGN UP & SET GOALS",
      description: "Create your profile and set your learning preferences.",
    },
    {
      icon: <FaRobot className="text-5xl text-blue-400" />,
      title: "STEP 2: AI-POWERED RECOMMENDATIONS",
      description: "Our AI personalizes study materials for you in real time.",
    },
    {
      icon: <FaChartLine className="text-5xl text-purple-400" />,
      title: "STEP 3: TRACK & IMPROVE",
      description: "Get real-time insights and adjust your learning path.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative min-h-screen flex flex-col items-center justify-center py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-center"
      style={{
        backgroundImage: 'url("/ctabg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.h2
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="text-6xl font-extrabold tracking-wide uppercase 
    bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text 
    drop-shadow-[3px_3px_0px_#000, -3px_-3px_0px_#000, 3px_-3px_0px_#000, -3px_3px_0px_#000]"
>
  How It Works
</motion.h2>

      <p className="text-gray-300 mt-4 text-3xl font-medium">
        A step-by-step guide to mastering your learning experience.
      </p>

      <div className="relative mt-16 flex flex-col items-center w-full max-w-3xl">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gray-600"></div>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
            className="relative w-full flex items-center mb-14"
          >
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full border-2 border-gray-800"></div>

            <div
              className={`w-[45%] p-6 rounded-lg border ${
                index % 2 === 0
                  ? "bg-gray-900 border-cyan-500 text-left ml-auto"
                  : "bg-gray-800 border-blue-500 text-right mr-auto"
              }`}
            >
              <div className="flex items-center gap-4">
                {index % 2 !== 0 && <div className="text-5xl">{step.icon}</div>}
                <div>
                  <h3 className="text-xl font-extrabold text-white uppercase tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 mt-2 font-medium">{step.description}</p>
                </div>
                {index % 2 === 0 && <div className="text-5xl">{step.icon}</div>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
