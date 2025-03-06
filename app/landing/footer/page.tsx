// src/app/landing/footer/page.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-[#1a2b3c] text-gray-300 py-14 text-center"
      style={{
        backgroundImage: 'url("/featurebg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 backdrop-blur-md opacity-80 z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <p className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-pink-400 neon-glow">
          Swift Prep
        </p>

        <div className="mt-6 flex justify-center space-x-10">
          {["About", "Privacy Policy", "Contact"].map((item, index) => (
            <Link
              key={index}
              href={`/${item.toLowerCase().replace(" ", "")}`}
              className="relative text-lg font-semibold text-gray-200 transition-all duration-300 ease-in-out hover:text-cyan-400 hover:scale-105 group"
            >
              {item}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} Swift Prep. All rights reserved.
        </p>
      </div>

      <div className="absolute inset-0 border-t border-gray-700 opacity-40 animate-pulse"></div>
    </footer>
  );
}
