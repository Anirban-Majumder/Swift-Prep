import LandingNavbar from "./landing/LandingNavbar";
import Hero from "./landing/Hero";
import HowItWorksPage from "./landing/how-it-works/page"; 
import FeaturesPage from "./landing/features/page"; 
import FAQPage from "./landing/testimonials/page"; 
import CTASection from "./landing/cta/page";
import Footer from "./landing/footer/page"; 

export default function LandingPage() {
  return (
    <div>
      <LandingNavbar />
      <Hero />
      <FeaturesPage />
      <HowItWorksPage />
      <FAQPage />
      <CTASection /> 
      <Footer /> 
    </div>
  );
}