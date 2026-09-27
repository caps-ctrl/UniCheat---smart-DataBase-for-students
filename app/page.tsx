import { NavBar } from "@/components/layout/Navbar/NavBar";

import { HeroSection } from "@/components/home/HeroSection/HeroSection";
import { WhyUsSection } from "@/components/home/WhyUsSection/WhyUsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection/HowItWorksSection";
import { AboutUsSection } from "@/components/home/AboutUsSection/AboutUsSection";
import { QuestionsSection } from "@/components/home/QuestionsSection/QuestionsSection";

export default function Home() {
  return (
    <main className="site-shell">
      <NavBar />
      <HeroSection />
      <WhyUsSection />
      <HowItWorksSection />
      <AboutUsSection />
      <QuestionsSection />

    </main>
  );
}
