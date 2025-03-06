//app>classroom>page.tsx

import Navbar from "../components/Navbar";
import HomePage from "../components/HomePage";

export default function Classroom() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <HomePage />
    </div>
  );
}
