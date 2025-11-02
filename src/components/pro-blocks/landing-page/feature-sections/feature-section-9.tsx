import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { BookOpen, FileText, Users, Zap } from "lucide-react";

export function FeatureSection9() {
  return (
    <section
      className="bg-secondary section-padding-y border-b border-gray-200"
      id="how-it-works"
    >
      <div className="container-padding-x container max-w-7xl mx-auto flex flex-col gap-16 md:gap-20">
        {/* For Teachers Section */}
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Image on the left */}
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Teacher illustration */}
                  <rect width="400" height="300" fill="url(#teacherGradient)" />
                  <defs>
                    <linearGradient
                      id="teacherGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                      <stop
                        offset="100%"
                        stopColor="#6366F1"
                        stopOpacity="0.2"
                      />
                    </linearGradient>
                  </defs>

                  {/* Whiteboard */}
                  <rect
                    x="50"
                    y="40"
                    width="300"
                    height="180"
                    rx="8"
                    fill="white"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />

                  {/* Teacher figure */}
                  <circle cx="320" cy="200" r="25" fill="#3B82F6" />
                  <rect
                    x="310"
                    y="225"
                    width="20"
                    height="40"
                    rx="10"
                    fill="#3B82F6"
                  />

                  {/* Quiz elements on board */}
                  <text
                    x="70"
                    y="70"
                    fontSize="14"
                    fill="#374151"
                    fontWeight="bold"
                  >
                    Quick Quiz
                  </text>
                  <circle cx="80" cy="100" r="3" fill="#3B82F6" />
                  <text x="95" y="105" fontSize="10" fill="#6B7280">
                    What is photosynthesis?
                  </text>
                  <circle cx="80" cy="130" r="3" fill="#3B82F6" />
                  <text x="95" y="135" fontSize="10" fill="#6B7280">
                    Name the process...
                  </text>
                  <circle cx="80" cy="160" r="3" fill="#3B82F6" />
                  <text x="95" y="165" fontSize="10" fill="#6B7280">
                    Which organelle...
                  </text>

                  {/* Lightning bolt for instant */}
                  <path
                    d="M280 80 L290 100 L285 100 L295 120 L285 100 L290 100 Z"
                    fill="#F59E0B"
                  />
                </svg>
              </div>
            </div>

            {/* Text content on the right */}
            <div className="order-1 lg:order-2 flex flex-col gap-8 mx- mx-auto">
              <div className="section-title-gap-lg  flex max-w-2xl flex-col items-start text-center">
                <Tagline>For Teachers</Tagline>
                <h2 className="heading-lg text-left text-foreground">
                  Turn Your Lessons Into Instant Assessments.
                </h2>
                <p className="text-muted-foreground text-base">
                  Check student understanding the moment you finish teaching —
                  not hours later.
                </p>
              </div>
              <div className="flex flex-col items-start gap-5">
                <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0px_0px_0px_4px_rgba(7,46,106,0.05)]">
                  <Zap className="text-primary h-5 w-5" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-foreground font-semibold">
                    Create instant quizzes.
                  </h3>
                  <p className="text-muted-foreground">
                    Generate quick questions from what you just taught in class.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-5">
                <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0px_0px_0px_4px_rgba(7,46,106,0.05)]">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-foreground font-semibold">
                    Measure comprehension.
                  </h3>
                  <p className="text-muted-foreground">
                    See which students grasped the topic and where to review
                    next.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* For Students Section */}
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Text content on the left */}
            <div className="order-1 lg:order-1 flex flex-col gap-8">
              <div className="section-title-gap-lg flex max-w-2xl flex-col items-center text-center">
                <Tagline>For Students</Tagline>
                <h2 className="heading-lg text-left text-foreground">
                  Turn Anything Into a Practice Test.
                </h2>
                <p className="text-muted-foreground text-base">
                  AITA builds quick questions from your study materials so you
                  can test yourself on any topic, anytime.
                </p>
              </div>
              <div className="flex flex-col items-start gap-5">
                <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0px_0px_0px_4px_rgba(7,46,106,0.05)]">
                  <FileText className="text-primary h-5 w-5" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-foreground font-semibold">
                    Test what you know — instantly.
                  </h3>
                  <p className="text-muted-foreground">
                    Quiz yourself before exams and reinforce concepts faster.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-5">
                <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0px_0px_0px_4px_rgba(7,46,106,0.05)]">
                  <BookOpen className="text-primary h-5 w-5" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-foreground font-semibold">
                    Revise smarter with AI-generated questions
                  </h3>
                  <p className="text-muted-foreground">
                    tailored to your notes.
                  </p>
                </div>
              </div>
            </div>

            {/* Image on the right */}
            <div className="order-2 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 p-8">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Student illustration */}
                  <rect width="400" height="300" fill="url(#studentGradient)" />
                  <defs>
                    <linearGradient
                      id="studentGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
                      <stop
                        offset="100%"
                        stopColor="#059669"
                        stopOpacity="0.2"
                      />
                    </linearGradient>
                  </defs>

                  {/* Laptop/Study materials */}
                  <rect
                    x="80"
                    y="120"
                    width="240"
                    height="140"
                    rx="12"
                    fill="white"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <rect
                    x="90"
                    y="130"
                    width="220"
                    height="120"
                    rx="8"
                    fill="#F9FAFB"
                  />

                  {/* Student figure */}
                  <circle cx="120" cy="80" r="25" fill="#10B981" />
                  <rect
                    x="110"
                    y="105"
                    width="20"
                    height="40"
                    rx="10"
                    fill="#10B981"
                  />

                  {/* Study content on screen */}
                  <text
                    x="110"
                    y="155"
                    fontSize="12"
                    fill="#374151"
                    fontWeight="bold"
                  >
                    Study Notes
                  </text>
                  <rect x="110" y="165" width="180" height="2" fill="#D1D5DB" />
                  <rect x="110" y="175" width="160" height="2" fill="#D1D5DB" />
                  <rect x="110" y="185" width="140" height="2" fill="#D1D5DB" />

                  {/* Quiz popup */}
                  <rect
                    x="200"
                    y="90"
                    width="150"
                    height="100"
                    rx="8"
                    fill="white"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <text
                    x="210"
                    y="110"
                    fontSize="10"
                    fill="#374151"
                    fontWeight="bold"
                  >
                    Quick Quiz
                  </text>
                  <circle cx="215" cy="125" r="2" fill="#10B981" />
                  <text x="225" y="128" fontSize="8" fill="#6B7280">
                    Question 1 of 5
                  </text>
                  <circle cx="215" cy="140" r="2" fill="#10B981" />
                  <text x="225" y="143" fontSize="8" fill="#6B7280">
                    A) Option A
                  </text>
                  <circle cx="215" cy="155" r="2" fill="#10B981" />
                  <text x="225" y="158" fontSize="8" fill="#6B7280">
                    B) Option B
                  </text>

                  {/* AI sparkles */}
                  <circle cx="160" cy="60" r="3" fill="#F59E0B" />
                  <circle cx="280" cy="70" r="2" fill="#F59E0B" />
                  <circle cx="340" cy="90" r="2" fill="#F59E0B" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
