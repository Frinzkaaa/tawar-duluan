import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import FeaturedCard from "./components/FeaturedCard";
import WhyChooseUs from "./components/WhyChooseUs";
import Faq from "./components/Faq";
import Contact from "./components/Contact";


export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <HowItWorks />
    <FeaturedCard />
    <WhyChooseUs />
    <Faq />
    <Contact />
    <Footer />
    </>
  );
}
