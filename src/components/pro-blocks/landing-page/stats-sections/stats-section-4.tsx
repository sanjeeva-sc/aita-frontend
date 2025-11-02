import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { Card, CardContent } from "@/components/ui/card";

export function StatsSection4() {
  return (
    <section
      className="bg-foreground section-padding-y border-b border-gray-200"
      id="security-compliance"
    >
      <div className="container-padding-x container mx-auto">
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
            <Tagline>Security & Compliance</Tagline>
            <h2 className="heading-lg text-background">
              Safe, Secure, and University-Ready
            </h2>
            <p className="text-background opacity-80">
              AITA follows strict data-protection standards so your content,
              quizzes, and student information stay private — always
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6 lg:flex-row">
            <Card className="bg-secondary rounded-xl border-none p-6 shadow-none">
              <CardContent className="flex flex-col gap-2 p-0 md:gap-3">
                <h3 className="text-primary font-semibold">Data Protection</h3>
                <span className="text-foreground text-3xl font-semibold md:text-4xl">
                  100%
                </span>

                <p className="text-muted-foreground text-base">
                  End-to-end encryption for data in transit and at rest,
                  securely stored within Australia
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary  rounded-xl border-none p-6 shadow-none">
              <CardContent className="flex flex-col gap-2 p-0 md:gap-3">
                <h3 className="text-primary font-semibold">Compliance</h3>
                <span className="text-foreground text-3xl font-semibold md:text-4xl">
                  8 Standards
                </span>
                <p className="text-muted-foreground text-base">
                  Compliant with APPs, TEQSA, ISO/IEC 27001, and
                  university-approved cloud environments
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary rounded-xl border-none p-6 shadow-none">
              <CardContent className="flex flex-col gap-2 p-0 md:gap-3">
                <h3 className="text-primary font-semibold">Trust Score</h3>
                <span className="text-foreground text-3xl font-semibold md:text-4xl">
                  Certified
                </span>
                <p className="text-muted-foreground text-base">
                  Trusted by educators and built to protect what matters most —
                  your data and your students
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
