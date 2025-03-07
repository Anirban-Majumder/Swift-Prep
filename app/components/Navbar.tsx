"use client";
import Link from "next/link";
import { CopilotManager } from "./copilot";

const Navbar = () => {
  return (
    <>
    <nav className="w-full fixed top-0 bg-black/60 backdrop-blur-md text-white py-4 px-8 flex justify-between items-center shadow-lg border-b border-gray-700">
      <div className="text-3xl font-bold text-blue-400 tracking-wide hover:text-blue-500 transition duration-300">
        <a
          href="/"
          className="text-3xl font-bold text-blue-400 tracking-wide hover:text-blue-500 transition duration-300"
        >
          Swift Prep
        </a>
      </div>

      <div className="flex space-x-6 text-lg font-medium">
        <a
          href="/classroom/study-materials"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-blue-400 after:left-0 after:bottom-0 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
        >
          📚 Study Materials
        </a>
        <a
          href="/Dashboard"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-blue-400 after:left-0 after:bottom-0 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
        >
          📊 Dashboard
        </a>
        <a
          href="/classroom/quizzes"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-blue-400 after:left-0 after:bottom-0 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
        >
          🎯 Quizzes
        </a>
        <Link
          href="/classroom/pro-ana"
          target="_blank"
          className="flex items-center gap-3 hover:text-blue-400 transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-blue-400 after:left-0 after:bottom-0 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
        >
          📈 Progress & Analytics
        </Link>
      </div>
    </nav>
    <CopilotManager />
    </>
    
  );
};

export default Navbar;
