// @ts-nocheck
"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Tilt from "react-parallax-tilt"; // Added for the tilt effect

const Hero = () => {
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  return (
    <section
      className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-24 min-h-screen overflow-hidden font-inter"
      style={{
        backgroundImage: 'url("/featurebg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay for Better Readability */}
      <div className="absolute inset-0 backdrop-blur-sm z-0" />
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "transparent" },
          particles: {
            number: { value: 150, density: { enable: true, value_area: 1000 } },
            color: { value: ["#00FFFF", "#FF00FF", "#FFA500"] },
            shape: { type: "star" },
            opacity: { value: 0.8, random: true },
            size: { value: 4, random: true },
            move: { enable: true, speed: 2, outModes: { default: "out" } },
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
              bubble: { distance: 150, size: 6, duration: 2 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
        }}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-2xl text-center md:text-left">
        <motion.h1
          className="text-6xl md:text-7xl font-bold leading-tight text-white font-poppins drop-shadow-[2px_2px_6px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <span className="inline-block min-w-[190px]">
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
          <br />
          <span className="text-white">Your Learning</span> <br />
          <span className="bg-gradient-to-r from-cyan-500 to-pink-600 text-transparent bg-clip-text">
            Experience
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-2xl md:text-3xl text-white font-poppins drop-shadow-[2px_2px_5px_rgba(0,0,0,0.7)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          AI-driven, personalized study tools to revolutionize the way you
          learn.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          className="mt-8 flex space-x-6 justify-center md:justify-start"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Link href="/creategoal">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition duration-300 drop-shadow-[2px_2px_6px_rgba(0,0,0,0.8)]">
              Get Started
            </button>
          </Link>
          <Link href="#features">
            <button className="border border-white text-white px-8 py-4 rounded-full text-lg font-medium bg-opacity-30 backdrop-blur-lg hover:bg-white hover:text-blue-600 transition duration-300 drop-shadow-[2px_2px_5px_rgba(0,0,0,0.8)]">
              Learn More
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Hero Image with Parallax Tilt */}
      <motion.div
        className="relative z-10 mt-12 md:mt-0 max-w-[500px] flex justify-center items-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
      >
        {/* Glowing Background Effect */}
        <motion.div
          className="absolute -z-10 w-[90%] h-[90%] bg-cyan-400 blur-[70px] opacity-40"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />

        {/* Floating Image with Tilt Effect */}
        <Tilt
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          perspective={1000}
          transitionSpeed={1000}
          glareEnable={true}
          glareMaxOpacity={0.4}
          glareColor="lightblue"
          className="rounded-lg"
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            whileHover={{ rotateY: 8, rotateX: 8, scale: 1.05 }}
          >
            <Image
              src="/Hero.jpeg"
              alt="Study AI"
              width={600}
              height={600}
              priority
              className="drop-shadow-lg rounded-lg ring-4 ring-cyan-400 transition-transform duration-300"
            />
          </motion.div>
        </Tilt>
      </motion.div>
    </section>
  );
};

export default Hero;
