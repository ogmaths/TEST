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
  Route,
  Shield,
  MessageSquare,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Star,
  ArrowRight,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center">
          <Logo size="md" variant="default" />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            href="#pricing"
          >
            Pricing
          </a>
          <a
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            href="#testimonials"
          >
            Stories
          </a>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            to="/login"
          >
            Login
          </Link>
          <Button asChild size="sm">
            <a href="#demo">Book Demo</a>
          </Button>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Support journeys that
                <span className="text-blue-600"> create lasting impact</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                OGstat helps charities and support services manage client
                journeys, track meaningful outcomes, and streamline
                operations—all in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-base px-8 py-3">
                  <a href="#demo">Book a Demo</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-3"
                >
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Feature 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Manage every client journey
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  From intake to exit, track each person's unique path through
                  your services. Custom assessments, progress notes, and
                  automated reporting help you demonstrate real impact to
                  funders and stakeholders.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Custom support journeys
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Progress tracking & scoring
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Automated impact reports
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 lg:p-12">
                <div className="space-y-4">
                  {/* Real Client Journey Timeline */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            JS
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Jane Smith
                          </div>
                          <div className="text-sm text-gray-500">
                            Housing Support Program
                          </div>
                        </div>
                      </div>
                      <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Add Interaction
                      </button>
                    </div>

                    {/* Timeline Events */}
                    <div className="space-y-4">
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="absolute left-1.5 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">
                              Phone Call
                            </div>
                            <div className="text-xs text-gray-500">
                              Discussed housing options and next steps
                            </div>
                            <div className="flex gap-1 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Housing
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Support
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            2 days ago
                          </span>
                        </div>
                      </div>

                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="absolute left-1.5 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">
                              Workshop Attendance
                            </div>
                            <div className="text-xs text-gray-500">
                              Financial Literacy Workshop - Community Center
                            </div>
                            <div className="flex gap-1 mt-1">
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                Workshop
                              </span>
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                Financial
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            1 week ago
                          </span>
                        </div>
                      </div>

                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">
                              Initial Assessment
                            </div>
                            <div className="text-xs text-gray-500">
                              Completed housing needs assessment
                            </div>
                            <div className="flex gap-1 mt-1">
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                Assessment
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            3 weeks ago
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        Recent Comments
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">JD</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs">
                            <span className="font-medium">John Doe</span>
                            <span className="text-gray-500 ml-1">2h ago</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            Great progress on housing application. @Sarah
                            Johnson please follow up next week.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 lg:p-12 order-2 lg:order-1">
                <div className="space-y-4">
                  {/* Real Admin Dashboard Metrics */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-900">
                        Organization Dashboard
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">Live</span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Phone className="h-4 w-4 text-blue-600" />
                          <span className="text-xs text-green-600 font-medium">
                            +12%
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          247
                        </div>
                        <div className="text-xs text-gray-600">Phone Calls</div>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                          <span className="text-xs text-green-600 font-medium">
                            +8%
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          156
                        </div>
                        <div className="text-xs text-gray-600">
                          Text Messages
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">
                            +15%
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          89
                        </div>
                        <div className="text-xs text-gray-600">
                          Clients Supported
                        </div>
                      </div>

                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <span className="text-xs text-green-600 font-medium">
                            +5%
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          23
                        </div>
                        <div className="text-xs text-gray-600">
                          Events Hosted
                        </div>
                      </div>
                    </div>

                    {/* Impact Score */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Overall Impact Score
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          87%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: "87%" }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Based on client outcomes and feedback
                      </div>
                    </div>
                  </div>

                  {/* Area Breakdown */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Area Performance
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            North Region
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            32
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            South Region
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            28
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            East Region
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div className="w-3/5 h-2 bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            19
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Prove your impact with data
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Generate compelling reports that show funders exactly how
                  their investment creates change. Track outcomes, measure
                  progress, and celebrate successes with clear, visual data that
                  tells your story.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Automated impact reports
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Outcome tracking & scoring
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Funder-ready presentations
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Secure, simple, and mobile-ready
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Built for teams on the go with bank-level security. Role-based
                  access keeps sensitive data protected while giving your team
                  the flexibility to work from anywhere, on any device.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Role-based permissions
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Mobile-optimized interface
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Enterprise-grade security
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-8 lg:p-12">
                <div className="space-y-4">
                  {/* Admin Dashboard Preview */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-6 w-6 text-purple-600" />
                      <span className="font-semibold text-gray-900">
                        Admin Dashboard
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Users</span>
                        </div>
                        <span className="text-sm text-gray-600">24 active</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Events</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          8 upcoming
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Reports</span>
                        </div>
                        <span className="text-sm text-gray-600">View all</span>
                      </div>
                    </div>
                  </div>

                  {/* Role-based Access */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Role-based Access
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-purple-600">
                            A
                          </span>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">Admin</div>
                          <div className="text-xs text-gray-500">
                            Full system control
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-600">
                            S
                          </span>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            Support Worker
                          </div>
                          <div className="text-xs text-gray-500">
                            Client management
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-green-600">
                            M
                          </span>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            Manager
                          </div>
                          <div className="text-xs text-gray-500">
                            Reports & oversight
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 lg:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Trusted by organizations making a difference
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See how charities and support services are using OGstat to
                amplify their impact
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    &quot;OGstat transformed how we track client progress. Our
                    funders love the detailed impact reports, and our team saves
                    hours each week.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        SH
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Sarah Henderson
                      </div>
                      <div className="text-sm text-gray-500">
                        Director, Community Housing Trust
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    &quot;The mobile app means our outreach workers can update
                    client records in real-time. It's made such a difference to
                    our data quality.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-600">
                        MJ
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Marcus Johnson
                      </div>
                      <div className="text-sm text-gray-500">
                        Operations Manager, Youth Support Network
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    &quot;We've been able to demonstrate a 40% improvement in
                    client outcomes since implementing OGstat. The data speaks
                    for itself.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-600">
                        EP
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Emma Patel
                      </div>
                      <div className="text-sm text-gray-500">
                        CEO, Family Support Services
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 lg:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Simple Pricing That Grows With You
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the plan that fits your organization's needs. All plans
                include unlimited beneficiaries.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter Plan */}
              <Card className="bg-white border-0 shadow-lg relative">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Starter
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    For pilot programs and small teams. Up to 3 staff or
                    volunteers.
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">
                      £99
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        Up to 3 staff members
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        Unlimited beneficiaries
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Basic reporting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Mobile access</span>
                    </li>
                  </ul>
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              {/* Professional Plan */}
              <Card className="bg-white border-0 shadow-lg relative border-2 border-blue-500">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Professional
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    For growing charities that need full reporting and
                    multi-role access.
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">
                      £159
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        Unlimited staff members
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        Unlimited beneficiaries
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Advanced reporting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Multi-role access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              {/* Custom Plan */}
              <Card className="bg-white border-0 shadow-lg relative">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Custom Plan
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    For large teams, funders, or umbrella orgs. Includes branded
                    CRM.
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-2xl font-bold text-gray-900">
                      Contact Us
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        Everything in Professional
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Branded CRM</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Custom integrations</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Dedicated support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        Training & onboarding
                      </span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full" size="lg">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Plan Benefits */}
            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>All plans include unlimited beneficiaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime – no long-term contracts</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 max-w-2xl mx-auto">
                * There is a setup fee which includes training and migrating
                data over to the system
              </p>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              See OGstat in action
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Book a free 30-minute demo to discover how OGstat can support your
              team's mission. See real examples of impact tracking and client
              journey management.
            </p>

            <Card className="max-w-lg mx-auto bg-white border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Request a Demo</CardTitle>
                <CardDescription>
                  We'll get back to you within 24 hours to schedule your
                  personalized demo.
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
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo size="md" variant="default" />
              <p className="text-sm text-gray-600 leading-relaxed">
                Built for nonprofits, by people who understand the mission.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#demo"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Request Demo
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
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
                    href="mailto:support@ogstat.app"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@ogstat.app"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <a
                    href="mailto:support@ogstat.app"
                    className="hover:text-gray-900 transition-colors"
                  >
                    support@ogstat.app
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>+44 (0) 123 456 7890</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>London, UK</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 OGstat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
