import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tagline } from "@/components/pro-blocks/landing-page/tagline"

export function FaqSection2() {
  return (
    <section className="bg-background section-padding-y border-b border-gray-200" aria-labelledby="faq-heading" id="faq">
      <div className="container-padding-x container mx-auto">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Left Column */}
          <div className="section-title-gap-lg flex flex-1 flex-col">
            {/* Category Tag */}
            <Tagline>FAQ</Tagline>
            {/* Main Title */}
            <h1 id="faq-heading" className="heading-lg text-foreground">
              Frequently Asked Questions
            </h1>
            {/* Section Description */}
            <p className="text-muted-foreground">
              Find answers to common questions about AITA. Can&apos;t find what you&apos;re looking for?{" "}
              <a href="#" className="text-primary underline">
                Contact us.
              </a>
            </p>
          </div>

          {/* Right Column */}
          <div className="flex flex-1 flex-col gap-8">
            {/* General FAQ Section */}
            <div className="flex flex-col gap-2">
              {/* Section Title */}
              <h2 className="text-foreground text-lg font-semibold md:text-xl">General</h2>
              {/* FAQ Accordion */}
              <Accordion type="single" collapsible aria-label="General FAQ items">
                {/* FAQ Item 1 */}
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">What is AITA?</AccordionTrigger>
                  <AccordionContent>
                    AITA is an AI-powered tool that turns your lectures, notes, or PDFs into ready-to-use quizzes in
                    seconds — designed for both teachers and students.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 2 */}
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">Is my data safe?</AccordionTrigger>
                  <AccordionContent>
                    Yes. All data is encrypted and securely stored locally in Australia, compliant with TEQSA and Australian Privacy Principles (APPs).
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 3 */}
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    Can AITA be used by both teachers and students?
                  </AccordionTrigger>
                  <AccordionContent>
                    Absolutely. Teachers can create quizzes to assess understanding, and students can use AITA to test themselves before exams.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 4 */}
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Do I need technical skills to use AITA?</AccordionTrigger>
                  <AccordionContent>
                    Not at all. If you can upload a file, you can create a quiz.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Integration FAQ Section */}
            <div className="flex flex-col gap-2">
              {/* Section Title */}
              <h2 className="text-foreground text-lg font-semibold md:text-xl">Integration & Compatibility</h2>
              {/* FAQ Accordion */}
              <Accordion type="single" collapsible aria-label="Integration FAQ items">
                {/* FAQ Item 1 */}
                <AccordionItem value="integration-1">
                  <AccordionTrigger className="text-left">
                    Does AITA work with my university's systems?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. AITA integrates with Google Drive, Moodle, Microsoft Teams, and Canvas.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 2 */}
                <AccordionItem value="integration-2">
                  <AccordionTrigger className="text-left">Is AITA mobile-friendly?</AccordionTrigger>
                  <AccordionContent>
                    Yes. You can create and take quizzes on your phone or tablet.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 3 */}
                <AccordionItem value="integration-3">
                  <AccordionTrigger className="text-left">Is AITA free to try?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Sign up for free and start generating quizzes instantly — no credit card required.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 4 */}
                <AccordionItem value="integration-4">
                  <AccordionTrigger className="text-left">Does AITA share my data?</AccordionTrigger>
                  <AccordionContent>
                    No. Your quizzes and materials remain private unless you choose to share them.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
