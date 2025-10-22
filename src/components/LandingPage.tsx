import { useUser, SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Brain,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Shield,
  Star,
  Zap,
  Upload,
  PenTool,
  Share2,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const LandingPage = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (isSignedIn) {
    // Redirect to dashboard if already signed in
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="text-xl font-bold text-slate-900">AiTA</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              How It Works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => navigate("/sign-up")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Learning Revolution
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight text-balance">
            Transform Your Transcripts into
            <span className="text-primary block mt-2">
              Smart Notes & Quizzes
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed text-pretty max-w-3xl mx-auto">
            Upload your class transcripts and let AI generate comprehensive
            notes and interactive quizzes. Perfect for students, educators, and
            professionals who want to maximize their learning efficiency.
          </p>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">
                Join 10,000+ learners
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-sm text-slate-600 ml-2">4.9/5 rating</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg"
              onClick={() => navigate("/sign-up")}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg bg-transparent"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </div>

          <p className="text-sm text-slate-500 mt-4">
            No credit card required • Free forever plan
          </p>
        </div>

        {/* Demo Preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
            <div className="relative bg-white rounded-2xl shadow-2xl border p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold">
                    Lecture_Notes_Biology_101.txt
                  </span>
                  <Badge variant="secondary">Processing...</Badge>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-200 rounded animate-pulse" />
                  <div className="h-2 bg-slate-200 rounded animate-pulse w-3/4" />
                  <div className="h-2 bg-slate-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Better Learning
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to transform passive listening into active
              learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Smart Note Generation</CardTitle>
                <CardDescription>
                  AI-powered analysis transforms your transcripts into
                  well-structured, comprehensive notes with key concepts
                  highlighted and organized by topics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Interactive Quizzes</CardTitle>
                <CardDescription>
                  Automatically generated multiple-choice quizzes help reinforce
                  learning and test comprehension with instant feedback and
                  explanations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Easy Export</CardTitle>
                <CardDescription>
                  Download your generated notes as PDF files for offline study,
                  sharing, or archiving your learning materials with custom
                  formatting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Process hours of transcripts in minutes. Our advanced AI works
                  at incredible speed without compromising on quality or
                  accuracy.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your transcripts and notes are encrypted and stored securely.
                  We never share your data and you maintain full control over
                  your content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Multiple Formats</CardTitle>
                <CardDescription>
                  Support for various transcript formats including audio files,
                  text documents, and direct uploads from popular platforms.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Transform your learning in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Upload Transcript",
                description:
                  "Simply drag and drop your transcript file or paste text directly into our platform.",
                icon: Upload,
              },
              {
                step: "02",
                title: "Generate Notes",
                description:
                  "Our AI analyzes your content and creates comprehensive, well-structured notes.",
                icon: PenTool,
              },
              {
                step: "03",
                title: "Create Quizzes",
                description:
                  "Automatically generate interactive quizzes to test comprehension and reinforce learning.",
                icon: Brain,
              },
              {
                step: "04",
                title: "Share & Export",
                description:
                  "Share quizzes with students or export notes as PDFs for offline study.",
                icon: Share2,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands of satisfied learners who've transformed their
              study habits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Medical Student",
                content:
                  "AiTA has revolutionized how I study. I can now turn 3-hour lectures into comprehensive notes in minutes. My grades have improved significantly!",
                rating: 5,
              },
              {
                name: "Marcus Johnson",
                role: "Corporate Trainer",
                content:
                  "The quiz generation feature is incredible. I use it to create training materials for my team. It saves me hours of work every week.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Graduate Student",
                content:
                  "The note organization is perfect. Everything is structured logically and the key concepts are highlighted. It's like having a personal study assistant.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-32">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: "10,000+", label: "Active Users" },
                { number: "50,000+", label: "Notes Generated" },
                { number: "99.9%", label: "Uptime" },
                { number: "4.9/5", label: "User Rating" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your learning needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold">
                  $0
                  <span className="text-lg font-normal text-slate-600">
                    /month
                  </span>
                </div>
                <CardDescription>Perfect for trying out AiTA</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "5 transcripts per month",
                    "Basic note generation",
                    "Simple quizzes",
                    "PDF export",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <SignInButton mode="modal">
                  <Button
                    className="w-full mt-6 bg-transparent"
                    variant="outline"
                  >
                    Get Started
                  </Button>
                </SignInButton>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-lg scale-105">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">
                  $19
                  <span className="text-lg font-normal text-slate-600">
                    /month
                  </span>
                </div>
                <CardDescription>
                  For serious learners and professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Unlimited transcripts",
                    "Advanced AI notes",
                    "Interactive quizzes",
                    "Priority support",
                    "Custom templates",
                    "Team collaboration",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <SignInButton mode="modal">
                  <Button className="w-full mt-6">Start Free Trial</Button>
                </SignInButton>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">Custom</div>
                <CardDescription>
                  For organizations and institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Everything in Pro",
                    "Custom integrations",
                    "Advanced analytics",
                    "Dedicated support",
                    "SSO & security",
                    "Volume discounts",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6 bg-transparent"
                  variant="outline"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA Section */}
        <div className="mt-32 text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary to-primary/80 text-white">
            <CardContent className="py-16 px-8">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of students and professionals who are already
                using AiTA to enhance their learning experience and achieve
                better results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="px-8 py-3 text-lg"
                  >
                    Start Your Free Trial
                  </Button>
                </SignInButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-primary bg-transparent"
                >
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-4">
                14-day free trial • No credit card required
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <span className="text-xl font-bold text-slate-900">AiTA</span>
              </div>
              <p className="text-slate-600 text-sm">
                Transform your transcripts into smart notes and quizzes with the
                power of AI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-slate-900">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-slate-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-slate-600">
            <p>&copy; 2024 AiTA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
