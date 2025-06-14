import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/Logo";
import { RequestDemoForm } from "@/components/RequestDemoForm";
import {
  Check,
  Users,
  BarChart3,
  Shield,
  MessageSquare,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Star,
  ArrowRight,
  Calendar,
  FileText,
  Heart,
  TrendingUp,
  Bell,
  Eye,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-off-white font-sans">
      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <Logo size="md" variant="default" />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            className="text-sm font-medium text-warm-grey hover:text-muted-teal transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium text-warm-grey hover:text-muted-teal transition-colors"
            href="#testimonials"
          >
            Testimonials
          </a>
          <a
            className="text-sm font-medium text-warm-grey hover:text-muted-teal transition-colors"
            href="#contact"
          >
            Contact
          </a>
          <Link
            className="text-sm font-medium text-warm-grey hover:text-muted-teal transition-colors"
            to="/login"
          >
            Login
          </Link>
          <Button
            asChild
            size="sm"
            className="bg-muted-teal hover:bg-muted-teal/90 text-white rounded-lg px-6"
          >
            <a href="#demo">Book a Demo</a>
          </Button>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-soft-lavender/30 to-sky-blue/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Welcome to
                <span className="text-muted-teal block mt-2">
                  Thrive Perinatal
                </span>
              </h1>
              <p className="text-2xl lg:text-3xl text-warm-grey mb-12 font-light leading-relaxed">
                Your Trusted Perinatal Care Hub
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-muted-teal hover:bg-muted-teal/90 text-white text-lg px-10 py-4 rounded-xl h-auto"
                >
                  <a href="#demo">Book a Demo</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-muted-teal text-muted-teal hover:bg-muted-teal hover:text-white text-lg px-10 py-4 rounded-xl h-auto"
                >
                  <a href="#contact">Contact Us</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Supporting Families from Bump to Baby and Beyond
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-warm-grey leading-relaxed mb-8">
                  Thrive Perinatal is a secure, modern platform built for
                  organisations supporting parents from pregnancy through early
                  parenthood.
                </p>
                <p className="text-xl text-warm-grey leading-relaxed">
                  Whether you're offering emotional support, wellbeing
                  programmes, or safeguarding assessments, Thrive helps your
                  team deliver personalised care—while tracking every step of
                  the journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 lg:py-32 bg-peach-beige/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Designed for Real-World Support Work
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="bg-white border-0 shadow-sm rounded-2xl p-8 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-soft-lavender rounded-2xl mb-6">
                    <FileText className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Dynamic Assessment Library
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    EPDS, WEMWBS, Outcome Star, DASH and more - all built-in and
                    ready to use with your clients.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="bg-white border-0 shadow-sm rounded-2xl p-8 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-blue/50 rounded-2xl mb-6">
                    <TrendingUp className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Full Journey Mapping
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Track every client from referral to exit with clear visual
                    timelines and progress indicators.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="bg-white border-0 shadow-sm rounded-2xl p-8 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-soft-coral/30 rounded-2xl mb-6">
                    <Bell className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Smart Risk Alerts
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Gentle prompts based on assessment results help your team
                    stay on top of what matters most.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="bg-white border-0 shadow-sm rounded-2xl p-8 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-moss-green/30 rounded-2xl mb-6">
                    <BarChart3 className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Insightful Outcome Reporting
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Generate meaningful reports that demonstrate your impact to
                    funders and stakeholders.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="bg-white border-0 shadow-sm rounded-2xl p-8 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-dusty-rose/30 rounded-2xl mb-6">
                    <Heart className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Intuitive Interface
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Designed with care workers in mind - simple, clear, and
                    accessible for teams and managers.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 6 */}
              <Card className="bg-white border-0 shadow-sm rounded-2xl p-8 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-soft-lavender rounded-2xl mb-6">
                    <Shield className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Secure & Compliant
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Built with privacy and security at its core, meeting all
                    healthcare data protection standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                What Organisations Are Saying
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <Card className="bg-soft-lavender/20 border-0 shadow-sm rounded-2xl p-10">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-moss-green text-moss-green"
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-800 leading-relaxed mb-8 italic">
                    &quot;Thrive gives our team gentle prompts when something
                    needs attention—it's like having an extra set of eyes on
                    each case. The journey mapping has transformed how we
                    support our families.&quot;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted-teal/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-muted-teal">
                        SH
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Sarah Henderson
                      </div>
                      <div className="text-sm text-warm-grey">
                        Director, Family Support Network
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sky-blue/20 border-0 shadow-sm rounded-2xl p-10">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-moss-green text-moss-green"
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-800 leading-relaxed mb-8 italic">
                    &quot;The assessment library saves us hours each week, and
                    the outcome reports help us demonstrate real impact to our
                    funders. It's exactly what we needed.&quot;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted-teal/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-muted-teal">
                        MJ
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Marcus Johnson
                      </div>
                      <div className="text-sm text-warm-grey">
                        Operations Manager, Perinatal Care Trust
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 lg:py-32 bg-gradient-to-br from-muted-teal/10 to-soft-lavender/20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Ready to Transform Perinatal Care?
            </h2>
            <p className="text-xl text-warm-grey mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the organisations already using Thrive Perinatal to deliver
              better outcomes for families. Book a demo to see how we can
              support your team.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-muted-teal hover:bg-muted-teal/90 text-white text-lg px-10 py-4 rounded-xl h-auto"
              >
                <a href="#demo">Book a Demo</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-muted-teal text-muted-teal hover:bg-muted-teal hover:text-white text-lg px-10 py-4 rounded-xl h-auto"
              >
                <a href="#features">Explore Features</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-24 lg:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              See Thrive Perinatal in Action
            </h2>
            <p className="text-xl text-warm-grey mb-12 max-w-2xl mx-auto leading-relaxed">
              Book a free 30-minute demo to discover how Thrive Perinatal can
              support your team's mission. See real examples of journey tracking
              and outcome reporting.
            </p>

            <Card className="max-w-lg mx-auto bg-white border-0 shadow-lg rounded-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  Request a Demo
                </CardTitle>
                <CardDescription className="text-warm-grey">
                  We'll get back to you within 24 hours to schedule your
                  personalised demo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequestDemoForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo size="md" variant="default" />
              <p className="text-sm text-warm-grey leading-relaxed">
                Supporting families through every step of their perinatal
                journey.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-warm-grey hover:text-muted-teal transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-warm-grey hover:text-muted-teal transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#demo"
                    className="text-warm-grey hover:text-muted-teal transition-colors"
                  >
                    Request Demo
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-warm-grey hover:text-muted-teal transition-colors"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="mailto:support@thriveperinatal.com"
                    className="text-warm-grey hover:text-muted-teal transition-colors"
                  >
                    Help Centre
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@thriveperinatal.com"
                    className="text-warm-grey hover:text-muted-teal transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-warm-grey hover:text-muted-teal transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-warm-grey hover:text-muted-teal transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-warm-grey">
                  <Mail className="h-4 w-4" />
                  <a
                    href="mailto:support@thriveperinatal.com"
                    className="hover:text-muted-teal transition-colors"
                  >
                    support@thriveperinatal.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-warm-grey">
                  <Phone className="h-4 w-4" />
                  <span>+44 (0) 123 456 7890</span>
                </li>
                <li className="flex items-center gap-2 text-warm-grey">
                  <MapPin className="h-4 w-4" />
                  <span>London, UK</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-sm text-warm-grey">
              © 2024 Thrive Perinatal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
