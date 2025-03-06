"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { SessionContext } from "@/lib/supabase/usercontext";
import Image from "next/image";

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { sessionData } = useContext(SessionContext);
  const isSignedIn = !!sessionData.session;

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  // Custom user button component
  const UserProfileButton = () => (
    <Link href="/SignOut">
      <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
        <User className="text-white" size={24} />
      </div>
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#1c2a40] via-[#1f3d60] to-[#2c3e50] text-white py-2 px-6 flex justify-between items-center z-50 shadow-lg border-b-4 border-blue-500"
    style={{ fontFamily: "'Bebas Neue', cursive" }}>
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image src="/icon.svg" alt="Logo" width={80} height={80} priority />
      </Link>

      {/* Hamburger Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Navbar Links */}
      <div className="hidden md:flex space-x-8 text-lg font-medium">
        {["features", "how-it-works", "faqs", "get started"].map((item) => (
          <a
            key={item}
            href={`#${item}`}
            onClick={(e) => handleScroll(e, item)}
            className="text-white hover:text-blue-400 transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-400 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
          >
            {item.replace("-", " ").toUpperCase()}
          </a>
        ))}

        {/* Classroom Link */}
        <Link
          href={isSignedIn ? "/classroom" : "/SignIn"}
          className="text-white hover:text-blue-400 transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-400 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
        >
          CLASSROOM
        </Link>
      </div>

      {/* Login / Sign Up / User Profile Buttons */}
      <div className="hidden md:flex space-x-4 items-center">
        {!isSignedIn ? (
          <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/SignIn">
                <button className="border bg-white border-blue-500 text-blue-500 px-5 py-2 rounded-full font-medium hover:bg-blue-400 hover:text-white transition duration-300">
                  LOGIN
                </button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/SignIn">
                <button className="bg-blue-500 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-600 transition duration-300">
                  SIGN UP
                </button>
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <UserProfileButton />
          </motion.div>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#1f3d60] shadow-lg flex flex-col items-center space-y-6 py-6">
          {["features", "how-it-works", "faqs", "cta"].map((item) => (
            <Link
              key={item}
              href={`#${item}`}
              className="text-white text-lg font-medium hover:text-blue-400 transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-400 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
            >
              {item.replace("-", " ").toUpperCase()}
            </Link>
          ))}

          {/* Login / Sign Up - Mobile */}
          {!isSignedIn ? (
            <>
              <Link href="/SignIn">
                <button className="border bg-white border-blue-500 text-blue-500 px-5 py-2 rounded-full font-medium hover:bg-blue-400 hover:text-white transition duration-300">
                  LOGIN
                </button>
              </Link>
              <Link href="/SignIn">
                <button className="bg-blue-500 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-600 transition duration-300">
                  SIGN UP
                </button>
              </Link>
            </>
          ) : (
            <UserProfileButton />
          )}
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;