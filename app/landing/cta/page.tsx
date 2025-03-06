import Link from "next/link";

export default function CTASection() {
  return (
    <section
      id="get started"
      className="py-24 text-white relative overflow-hidden"
      style={{
        backgroundImage: 'url("/ctabg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2
          className="text-5xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-white
-pink-400 mb-6"
          style={{ fontFamily: "'Poppins', cursive" }}
        >
          READY TO BOOST YOUR LEARNING?
        </h2>
        <p
          className="mt-2 text-gray-400 text-2xl opacity-90 max-w-2xl mx-auto"
          style={{ fontFamily: "'Poppins', cursive" }}
        >
          Join Swift Prep today and get personalized study recommendations
          powered by AI.
        </p>
        <div className="mt-10 flex justify-center space-x-6">
          <Link href="/SignIn">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-110 hover:shadow-2xl">
              GET STARTED
            </button>
          </Link>
          <Link href="/SignIn">
            <button className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg transition-transform transform hover:bg-white hover:text-blue-600 hover:scale-110 hover:shadow-2xl">
              LOG IN
            </button>
          </Link>
        </div>
      </div>

      {/* Background Animated Wave */}
      <div className="absolute top-0 left-0 w-full h-full bg-wave bg-opacity-20 z-[-1]" />
    </section>
  );
}
