import Link from "next/link";

export default function CTASection() {
  return (
    <section
      id="get-started"
      className="relative py-32 text-white text-center overflow-hidden"
      style={{
        backgroundImage: 'url("/ctabg.jpg")',
        backgroundSize: "110%", 
        backgroundPosition: "center",
        backgroundAttachment: "fixed", 
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h2 className="text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-pink-400 drop-shadow-lg">
          READY TO BOOST YOUR LEARNING?
        </h2>
        <p className="mt-4 text-gray-300 text-2xl max-w-2xl mx-auto leading-relaxed">
          Join <span className="text-white font-bold">Swift Prep</span> today and get
          AI-powered personalized study recommendations.
        </p>

        <div className="mt-10 flex justify-center space-x-6">
          <Link href="/SignIn">
            <button className="px-10 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-blue-500/50">
              GET STARTED
            </button>
          </Link>
          <Link href="/SignIn">
            <button className="px-10 py-4 border-2 border-white text-white font-bold rounded-lg transition-transform transform hover:bg-white hover:text-blue-600 hover:scale-105 hover:shadow-lg">
              LOG IN
            </button>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-10 w-40 h-40 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-500 blur-3xl opacity-25 animate-pulse" />
      </div>
    </section>
  );
}
