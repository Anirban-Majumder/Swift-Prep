"use client";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-6">
      <h1 className="text-5xl font-extrabold text-center mb-6 tracking-wide drop-shadow-md">
        Welcome to Your Classroom
      </h1>
      <p className="text-lg text-gray-300 text-center max-w-2xl">
        Access your study materials, track progress, and enhance your learning
        experience with AI-powered insights!
      </p>
      <Link
        href="/Dashboard"
        className="mt-6 px-6 py-3 bg-blue-500 h over:bg-blue-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300"
      >
        Get Started
      </Link>
    </div>
  );
};

export default HomePage;
