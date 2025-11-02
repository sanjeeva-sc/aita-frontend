import { Tagline } from "@/components/pro-blocks/landing-page/tagline";

const testimonials = [
  "I didn't realise how much I forgot until I tested myself.",
  "One quick quiz showed me what my students actually struggled with.",
  "I revised on the train — and it finally stuck.",
  "Students asking their own questions changed everything."
];

export function TestimonialsStoriesSection() {
  return (
    <section
      className="bg-secondary section-padding-y border-b border-gray-200"
      aria-labelledby="testimonials-heading"
      id="testimonials"
    >
      <div className="container-padding-x container mx-auto">
        <div className="flex flex-col gap-10 md:gap-12">
          {/* Section Header */}
          <div className="section-title-gap-lg flex max-w-2xl mx-auto flex-col items-center text-center">
            {/* Category Tag */}
            <Tagline>Stories & Testimonials</Tagline>
            {/* Main Title */}
            <h2
              id="testimonials-heading"
              className="heading-lg text-foreground"
            >
              How AITA is Changing the Way We Learn
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((quote, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 p-6 bg-background rounded-xl border shadow-sm"
              >
                <blockquote className="text-center text-base font-medium text-foreground leading-relaxed">
                  &quot;{quote}&quot;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}