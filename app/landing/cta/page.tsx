import Link from "next/link";

export default function CTASection() {
  return (
    <section
      id="get started"
      className="py-24 bg-gradient-to-r from-gray-800 to-black
 text-center text-white relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2
          className="text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-blue-900 to-teal-800
-pink-400 mb-6"
        >
          Ready to Boost Your Learning?
        </h2>
        <p className="mt-2 text-lg opacity-90 max-w-2xl mx-auto">
          Join StudyAI today and get personalized study recommendations powered
          by AI.
        </p>
        <div className="mt-10 flex justify-center space-x-6">
          <Link href="/reg-form">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-110 hover:shadow-2xl">
              Get Started
            </button>
          </Link>
          <Link href="/sign-in">
            <button className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg transition-transform transform hover:bg-white hover:text-blue-600 hover:scale-110 hover:shadow-2xl">
              Log In
            </button>
          </Link>
        </div>
      </div>

      {/* Background Animated Wave */}
      <div className="absolute top-0 left-0 w-full h-full bg-wave bg-opacity-20 z-[-1]" />
    </section>
  );
}
