import { Card, CardContent } from "@/components/ui/card"
import { Tagline } from "@/components/pro-blocks/landing-page/tagline"
import AiMeetingNotesImage from "@/assets/ai-meeting-notes.png"
import AiMeetingNotesMobileImage from "@/assets/ai-meeting-notes_mobile.png"
import UniversalSearchImage from "@/assets/universal-search.png"
import SmartTagsImage from "@/assets/smart-tags.png"
import TeamInsightsImage from "@/assets/team-insights.png"
import TeamInsightsMobileImage from "@/assets/team-insights_mobile.png"

export function BentoGrid6() {
  return (
    <section className="bg-background section-padding-y border-b border-gray-200" id="features">
      <div className="container-padding-x container max-w-7xl mx-auto flex flex-col gap-10 md:gap-12">
        {/* Section Title */}
        <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
          {/* Tagline */}
          <Tagline>Why Teachers and Students Love AITA</Tagline>
          {/* Main Heading */}
          <h2 className="heading-lg">Everything you need to create and learn in one place</h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {/* Wide Feature Card - Top Left */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-2">
            <img
              src={AiMeetingNotesImage}
              alt="AI-Powered Quiz Generation"
              className="hidden h-auto w-full object-cover md:block md:h-[332px]"
            />
            <img
              src={AiMeetingNotesMobileImage}
              alt="AI-Powered Quiz Generation"
              className="block h-auto w-full md:hidden"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">Generate Quizzes Instantly</h3>
              <p className="text-muted-foreground">
                Generate quizzes, tests, and practice sets instantly from your teaching content
              </p>
            </CardContent>
          </Card>
          {/* Regular Feature Card - Top Right */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-1">
            <img
              src={UniversalSearchImage}
              alt="Time-Saving Automation"
              className="h-auto w-full object-cover md:h-[332px]"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">Save Time</h3>
              <p className="text-muted-foreground">Spend minutes, not hours, preparing assessments and grading</p>
            </CardContent>
          </Card>
          {/* Regular Feature Card - Bottom Left */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-1">
            <img
              src={SmartTagsImage}
              alt="Multi-Format Support"
              className="h-auto w-full object-cover md:h-[332px]"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">Multi-Format Support</h3>
              <p className="text-muted-foreground">
                Upload PDFs, videos, notes — AITA understands and converts them all
              </p>
            </CardContent>
          </Card>
          {/* Wide Feature Card - Bottom Right */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-2">
            <img
              src={TeamInsightsImage}
              alt="Instant Feedback & Insights"
              className="hidden h-[332px] w-full object-cover md:block"
            />
            <img
              src={TeamInsightsMobileImage}
              alt="Instant Feedback & Insights"
              className="block h-auto w-full object-cover md:hidden md:h-[332px]"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">View Student Performance</h3>
              <p className="text-muted-foreground">View student performance analytics and identify key learning gaps</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
