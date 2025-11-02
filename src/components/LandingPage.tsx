import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { BentoGrid6 } from "./pro-blocks/landing-page/bento-grids/bento-grid-6";
import { FaqSection2 } from "./pro-blocks/landing-page/faq-sections/faq-section-2";
import { CoreFeaturesSection } from "./pro-blocks/landing-page/feature-sections/core-features-section";
import { FeatureSection9 } from "./pro-blocks/landing-page/feature-sections/feature-section-9";
import { Footer1 } from "./pro-blocks/landing-page/footers/footer-1";
import { HeroSection2 } from "./pro-blocks/landing-page/hero-sections/hero-section-2";
import { LpNavbar1 } from "./pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { StatsSection4 } from "./pro-blocks/landing-page/stats-sections/stats-section-4";
import { TestimonialsStoriesSection } from "./pro-blocks/landing-page/testimonials-sections/testimonials-section-stories";

const LandingPage = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isSignedIn) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <LpNavbar1 />
      <HeroSection2 />
      {/* <LogoSection10 /> */}
      <CoreFeaturesSection />
      {/* <TestimonialsSection1
        quote="AiTA is like having a photographic memory for every meeting. We reduced the follow-up emails by 80%."
        authorName="David Park"
        authorRole="Engineering Manager at TechCorp"
        // avatarSrc="/DavidPark.png"
      /> */}
      <BentoGrid6 />
      <FeatureSection9 />
      <StatsSection4 />
      {/* <TestimonialsSection1
        quote="At TechStar, 43% of meeting content was forgotten within 24 hours. Now, the AI summaries are better than my own notes!"
        authorName="Monica Kurt"
        authorRole="Project Manager at TechStar"
        avatarSrc="/MonicaKurt.png"
      /> */}
      {/* <PricingSection3 /> */}
      <TestimonialsStoriesSection />
      <FaqSection2 />
      <Footer1 />
    </div>
  );
};

export default LandingPage;
