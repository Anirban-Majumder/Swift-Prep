// src/app/landing/footer/page.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-gradient-to-r from-[#000000] via-[#1d1d1d] to-[#1a2b3c] text-gray-400 py-12 text-center relative overflow-hidden"
      style={{
        backgroundImage: 'url("/featurebg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ><div className="absolute inset-0 backdrop-blur-sm z-0" />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-teal-500 to-blue-500 neon-glow">
          Swift Prep
        </p>
        <div className="mt-6 flex justify-center space-x-8">
          <Link
            href="/about"
            className="text-lg font-semibold text-gray-300 hover:text-pink-400 transition duration-300 ease-in-out hover:underline transform hover:scale-110"
          >
            ABOUT
          </Link>
          <Link
            href="/privacypolicy"
            className="text-lg font-semibold text-gray-300 hover:text-pink-400 transition duration-300 ease-in-out hover:underline transform hover:scale-110"
          >
            PRIVACY POLICY
          </Link>
          <Link
            href="/contact"
            className="text-lg font-semibold text-gray-300 hover:text-pink-400 transition duration-300 ease-in-out hover:underline transform hover:scale-110"
          >
            CONTACT
          </Link>
        </div>
        <p className="mt-8 text-lg text-gray-300">
          © {new Date().getFullYear()} Swift Prep. All rights reserved.
        </p>
      </div>

      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
    </footer>
  );
}
