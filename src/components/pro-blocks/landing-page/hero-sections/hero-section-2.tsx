import HeroImage from "@/assets/Hero.png";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection2() {
  const navigate = useNavigate();
  return (
    <section
      className="bg-secondary section-padding-y"
      aria-labelledby="hero-heading"
    >
      <div className="container-padding-x container max-w-7xl mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-6 lg:gap-8">
          {/* Section Title */}
          <div className="section-title-gap-xl flex flex-col">
            {/* Tagline */}
            <Tagline>AITA</Tagline>
            {/* Main Heading */}
            <h1 id="hero-heading" className="heading-xl">
              Turn Any Lecture Into a Quiz in Seconds
            </h1>
            {/* Description */}
            <p className="text-muted-foreground text-base lg:text-lg">
              Upload your lecture notes, slides, or videos — and AITA instantly
              generates ready-to-use quizzes to teach, test, and learn smarter.
            </p>
          </div>

          {/* Feature List */}
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Check className="text-primary h-5 w-5" />
              </div>
              <span className="text-card-foreground text-base leading-6 font-medium">
                AI-powered quiz generation
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Check className="text-primary h-5 w-5" />
              </div>
              <span className="text-card-foreground text-base leading-6 font-medium">
                Multi-format support (PDFs, transcripts, notes)
              </span>
            </div>

            {/* <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Check className="text-primary h-5 w-5" />
              </div>
              <span className="text-card-foreground text-base leading-6 font-medium">
                Works with all major LMS platforms
              </span>
            </div> */}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigate("/signup")}>Try AITA Free</Button>
            <Button
              variant="ghost"
              onClick={() =>
                window.open("https://youtu.be/_XlaHiMA5kY", "_blank")
              }
            >
              Watch Demo
              <ArrowRight />
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full flex-1">
          <AspectRatio ratio={1 / 1}>
            <img
              src={HeroImage}
              alt="AITA quiz generation interface"
              className="h-full w-full rounded-xl object-cover"
            />
          </AspectRatio>
        </div>
      </div>
    </section>
  );
}
