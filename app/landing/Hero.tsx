"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const Hero = () => {
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-24 min-h-screen bg-gradient-to-br from-[#0c1022] via-[#1a1a40] to-[#0c1022] text-white overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
       
        options={{
          fullScreen: { enable: false },
          background: { color: "transparent" },
          particles: {
            number: { value: 150, density: { enable: true,  } },
            color: { value: ["#00FFFF", "#FF00FF", "#FFA500"] },
            shape: { type: "star" },

            opacity: { value: 0.8, animation: { enable: true, speed: 0.5,  sync: false } },
            size: { value: 4 },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: false,
              straight: false,
              outModes: { default: "out" },
            },
            links: {
              enable: true,
              color: "#ffffff",
              distance: 200,
              opacity: 0.4,
              width: 1.5,
            },

          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "bubble" },
              onClick: { enable: true, mode: "repulse" },
            },
            modes: {
              bubble: { distance: 150, size: 6, duration: 2, opacity: 1 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
        }}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Left Side - Text */}
      <div className="relative z-10 max-w-2xl">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold leading-tight text-center md:text-left"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <span className="text-white inline-block min-w-[190px] text-left">
            <Typewriter
              words={["Innovate", "Transform", "Personalize", "Empower"]}
              loop
              cursor
              cursorStyle="|"
              typeSpeed={80}
              deleteSpeed={50}
              delaySpeed={2500}
            />
          </span>
          Your Learning <br />
          <span className="bg-gradient-to-r from-cyan-400 to-pink-400 text-transparent bg-clip-text">
            Experience
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-gray-300 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          AI-driven, personalized study tools to revolutionize the way you learn.
        </motion.p>

        <motion.div
          className="mt-8 flex space-x-6 justify-center md:justify-start"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Link href="/creategoal">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
              Get Started
            </button>
          </Link>
          <Link href="#features">
            <button className="border border-white text-white px-8 py-4 rounded-full text-lg font-medium bg-opacity-30 backdrop-blur-lg hover:bg-white hover:text-blue-600 transition duration-300">
              Learn More
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Right Side - Image with Effects */}
      <motion.div
        className="relative z-10 mt-12 md:mt-0 max-w-[500px] flex justify-center items-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
      >
        {/* Blurred Glow Effect */}
        <motion.div
          className="absolute -z-10 w-[90%] h-[90%] bg-cyan-400 blur-[70px] opacity-40"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />

        <motion.div
          className="relative"
          animate={{
            y: [0, -8, 0],
            boxShadow: [
              "0 0 15px rgba(0, 255, 255, 0.3), 0 0 30px rgba(255, 0, 255, 0.3)",
              "0 0 25px rgba(0, 255, 255, 0.5), 0 0 35px rgba(255, 0, 255, 0.5)",
              "0 0 15px rgba(0, 255, 255, 0.3), 0 0 30px rgba(255, 0, 255, 0.3)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          whileHover={{ rotateY: 8, rotateX: 8, scale: 1.05 }}
        >
          <Image
            src="/Hero.jpeg"
            alt="Study AI"
            width={500} // Reduced size
            height={500}
            priority
            className="drop-shadow-lg rounded-lg ring-4 ring-cyan-400 hover:rotate-2 transition-transform duration-300"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
