// src/app/landing/footer/page.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#000000] via-[#1d1d1d] to-[#1a2b3c] text-gray-400 py-12 text-center relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-teal-500 to-blue-500 neon-glow">
          StudyAI
        </p>
        <div className="mt-6 flex justify-center space-x-8">
          <Link
            href="/about"
            className="text-lg font-semibold text-gray-300 hover:text-pink-400 transition duration-300 ease-in-out hover:underline transform hover:scale-110"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-lg font-semibold text-gray-300 hover:text-pink-400 transition duration-300 ease-in-out hover:underline transform hover:scale-110"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-lg font-semibold text-gray-300 hover:text-pink-400 transition duration-300 ease-in-out hover:underline transform hover:scale-110"
          >
            Contact
          </Link>
        </div>
        <p className="mt-8 text-sm text-gray-300">
          © {new Date().getFullYear()} StudyAI. All rights reserved.
        </p>
      </div>

      {/* Background Glow Effect */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-900 via-purple-800 to-black
 opacity-30"
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
    </footer>
  );
}
