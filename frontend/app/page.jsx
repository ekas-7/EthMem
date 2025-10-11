import { cn } from "../lib/cn";
import Header from "./components/Header.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Pricing from "./components/Pricing.jsx";
import Testimonials from "./components/Testimonials.jsx";
import FAQ from "./components/FAQ.jsx";

export default function Home() {
  return (
    <div className={cn("min-h-screen flex flex-col items-stretch justify-start px-8  space-y-8 bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary")}>
      <Header />
      <main>
        
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
    </div>
  );
}
