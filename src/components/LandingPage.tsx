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
  Activity,
  UserCheck,
  AlertTriangle,
  Settings,
} from "lucide-react";

// Add custom CSS animations
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slide-in-right {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slide-in-left {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes scale-in {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes zoom-in {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-3deg); }
    75% { transform: rotate(3deg); }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes progress {
    from { width: 0%; }
    to { width: 75%; }
  }
  @keyframes bar-chart {
    from { height: 0; }
    to { height: var(--final-height); }
  }
  
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-fade-in { animation: fade-in 1s ease-out; }
  .animate-slide-up { animation: slide-up 0.8s ease-out; }
  .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
  .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
  .animate-scale-in { animation: scale-in 0.8s ease-out; }
  .animate-zoom-in { animation: zoom-in 0.8s ease-out; }
  .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
  .animate-heartbeat { animation: heartbeat 2s ease-in-out infinite; }
  .animate-rotate { animation: rotate 8s linear infinite; }
  .animate-spin-slow { animation: spin-slow 4s linear infinite; }
  .animate-progress { animation: progress 2s ease-out; }
  .animate-bar-chart { animation: bar-chart 1.5s ease-out; }
  
  .animation-delay-0 { animation-delay: 0ms; }
  .animation-delay-100 { animation-delay: 100ms; }
  .animation-delay-200 { animation-delay: 200ms; }
  .animation-delay-300 { animation-delay: 300ms; }
  .animation-delay-400 { animation-delay: 400ms; }
  .animation-delay-600 { animation-delay: 600ms; }
  
  .animate-bar-chart:nth-child(1) { --final-height: 2rem; }
  .animate-bar-chart:nth-child(2) { --final-height: 3rem; }
  .animate-bar-chart:nth-child(3) { --final-height: 1.5rem; }
  .animate-bar-chart:nth-child(4) { --final-height: 2.5rem; }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = animationStyles;
  document.head.appendChild(styleElement);
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-off-white font-sans">
      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm">
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
            href="#about"
          >
            About
          </a>
          <a
            className="text-sm font-medium text-warm-grey hover:text-muted-teal transition-colors"
            href="#testimonials"
          >
            Testimonials
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
            className="bg-muted-teal hover:bg-muted-teal/90 text-white rounded-xl px-6 shadow-sm"
          >
            <a href="#demo">Book a Demo</a>
          </Button>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-soft-lavender/20 to-sky-blue/15 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Welcome to
                  <span className="text-muted-teal block mt-2">
                    Thrive Perinatal
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-warm-grey mb-8 font-light leading-relaxed">
                  Your Complete Perinatal Care Management Platform
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-muted-teal hover:bg-muted-teal/90 text-white text-lg px-8 py-4 rounded-xl h-auto shadow-lg hover:shadow-xl transition-all"
                  >
                    <a href="#demo">Book a Demo</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-muted-teal text-muted-teal hover:bg-muted-teal hover:text-white text-lg px-8 py-4 rounded-xl h-auto transition-all"
                  >
                    <a href="#features">Explore Features</a>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-4 transform rotate-1 hover:rotate-0 transition-transform duration-300 animate-pulse">
                  <div className="w-full h-96 rounded-xl border-0 bg-gradient-to-br from-muted-teal/10 to-soft-lavender/10 flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-full flex-col items-center justify-center text-center p-8 animate-fade-in">
                      <div className="w-16 h-16 bg-muted-teal/20 rounded-2xl flex items-center justify-center mb-4 animate-bounce">
                        <Users className="h-8 w-8 text-muted-teal animate-pulse" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 animate-slide-up">
                        Worker Dashboard
                      </h3>
                      <p className="text-sm text-warm-grey animate-slide-up animation-delay-200">
                        Comprehensive client management and progress tracking
                      </p>
                      <div className="mt-4 flex space-x-2">
                        <div className="w-3 h-3 bg-muted-teal rounded-full animate-ping"></div>
                        <div className="w-3 h-3 bg-moss-green rounded-full animate-ping animation-delay-100"></div>
                        <div className="w-3 h-3 bg-dusty-rose rounded-full animate-ping animation-delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-moss-green text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg animate-slide-in-right">
                  Worker Dashboard
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                From Bump to Baby and Beyond
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

            {/* Embedded Screenshot Panel */}
            <div className="bg-gradient-to-r from-peach-beige/30 to-soft-lavender/20 rounded-3xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Complete Journey Visibility
                  </h3>
                  <p className="text-warm-grey leading-relaxed mb-6">
                    Track every client interaction, milestone, and outcome with
                    our intuitive timeline view. See the full picture of each
                    family's journey at a glance.
                  </p>
                  <div className="flex items-center gap-2 text-muted-teal font-medium">
                    <TrendingUp className="h-5 w-5" />
                    <span>Real-time progress tracking</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 animate-float">
                  <div className="w-full h-72 rounded-xl border-0 bg-gradient-to-br from-peach-beige/20 to-soft-lavender/10 flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-full flex-col items-center justify-center text-center p-6 animate-fade-in">
                      <div className="w-12 h-12 bg-muted-teal/20 rounded-2xl flex items-center justify-center mb-3 animate-spin-slow">
                        <TrendingUp className="h-6 w-6 text-muted-teal animate-pulse" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-1 animate-slide-up">
                        Client Journey Timeline
                      </h4>
                      <p className="text-xs text-warm-grey animate-slide-up animation-delay-100">
                        Complete journey visibility and tracking
                      </p>
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2 animate-pulse">
                        <div
                          className="bg-gradient-to-r from-muted-teal to-moss-green h-2 rounded-full animate-progress"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-muted-teal" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">15+</p>
                <p className="text-sm text-warm-grey">Organizations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-moss-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-moss-green" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">200+</p>
                <p className="text-sm text-warm-grey">Events Managed</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-dusty-rose/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-dusty-rose" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">95%</p>
                <p className="text-sm text-warm-grey">Satisfaction Rate</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-soft-lavender rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-muted-teal" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">40%</p>
                <p className="text-sm text-warm-grey">Time Saved</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 lg:py-32 bg-gradient-to-b from-off-white to-peach-beige/20"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Complete Platform for Perinatal Care
              </h2>
              <p className="text-xl text-warm-grey max-w-3xl mx-auto">
                From client management to assessment tracking, event
                coordination to impact reporting - everything you need in one
                integrated platform.
              </p>
            </div>

            <div className="space-y-20">
              {/* Feature 1 - Assessment Tools */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-soft-lavender rounded-2xl mb-6">
                    <FileText className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                    Comprehensive Assessment Library
                  </h3>
                  <p className="text-lg text-warm-grey leading-relaxed mb-6">
                    EPDS, WEMWBS, Outcome Star, DASH and more - all built-in and
                    ready to use with your clients. Streamline data collection
                    with intelligent forms that adapt to your workflow.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-warm-grey">
                      <Check className="h-5 w-5 text-moss-green" />
                      <span>Pre-built validated assessments</span>
                    </li>
                    <li className="flex items-center gap-3 text-warm-grey">
                      <Check className="h-5 w-5 text-moss-green" />
                      <span>Custom form builder</span>
                    </li>
                    <li className="flex items-center gap-3 text-warm-grey">
                      <Check className="h-5 w-5 text-moss-green" />
                      <span>Automated scoring and alerts</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 animate-scale-in">
                  <div className="w-full h-80 rounded-xl border-0 bg-gradient-to-br from-soft-lavender/20 to-sky-blue/10 flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-full flex-col items-center justify-center text-center p-6 animate-fade-in">
                      <div className="w-12 h-12 bg-soft-lavender rounded-2xl flex items-center justify-center mb-3 animate-wiggle">
                        <FileText className="h-6 w-6 text-muted-teal animate-pulse" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-1 animate-slide-up">
                        Assessment Builder
                      </h4>
                      <p className="text-xs text-warm-grey animate-slide-up animation-delay-100">
                        EPDS, WEMWBS & custom assessments
                      </p>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="h-8 bg-soft-lavender/30 rounded animate-pulse animation-delay-0"></div>
                        <div className="h-8 bg-sky-blue/30 rounded animate-pulse animation-delay-100"></div>
                        <div className="h-8 bg-muted-teal/30 rounded animate-pulse animation-delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Smart Alerts */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-soft-coral/30 rounded-2xl mb-6">
                    <Bell className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                    Intelligent Risk Management
                  </h3>
                  <p className="text-lg text-warm-grey leading-relaxed mb-6">
                    Gentle prompts based on assessment results help your team
                    stay on top of what matters most. Never miss a critical
                    follow-up or intervention opportunity.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-warm-grey">
                      <AlertTriangle className="h-5 w-5 text-dusty-rose" />
                      <span>Automated risk flagging</span>
                    </li>
                    <li className="flex items-center gap-3 text-warm-grey">
                      <Bell className="h-5 w-8 text-dusty-rose" />
                      <span>Customizable alert thresholds</span>
                    </li>
                    <li className="flex items-center gap-3 text-warm-grey">
                      <UserCheck className="h-5 w-5 text-dusty-rose" />
                      <span>Team notification system</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:order-1 bg-white rounded-2xl shadow-xl p-6 animate-slide-in-left">
                  <div className="w-full h-80 rounded-xl border-0 bg-gradient-to-br from-soft-coral/20 to-peach-beige/20 flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-full flex-col items-center justify-center text-center p-6 animate-fade-in">
                      <div className="w-12 h-12 bg-soft-coral/30 rounded-2xl flex items-center justify-center mb-3 animate-heartbeat">
                        <BarChart3 className="h-6 w-6 text-muted-teal animate-pulse" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-1 animate-slide-up">
                        Client Dashboard
                      </h4>
                      <p className="text-xs text-warm-grey animate-slide-up animation-delay-100">
                        Intelligent risk management & alerts
                      </p>
                      <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-8 bg-soft-coral rounded animate-bar-chart animation-delay-0"></div>
                        <div className="w-2 h-12 bg-peach-beige rounded animate-bar-chart animation-delay-100"></div>
                        <div className="w-2 h-6 bg-dusty-rose rounded animate-bar-chart animation-delay-200"></div>
                        <div className="w-2 h-10 bg-muted-teal rounded animate-bar-chart animation-delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Admin Panel */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-blue/50 rounded-2xl mb-6">
                    <Settings className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                    Powerful Administration Tools
                  </h3>
                  <p className="text-lg text-warm-grey leading-relaxed mb-6">
                    Comprehensive admin panel for managing users, organizations,
                    and system settings. Generate meaningful reports that
                    demonstrate your impact to funders and stakeholders.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-warm-grey">
                      <BarChart3 className="h-5 w-5 text-moss-green" />
                      <span>Advanced reporting and analytics</span>
                    </li>
                    <li className="flex items-center gap-3 text-warm-grey">
                      <Users className="h-5 w-5 text-moss-green" />
                      <span>User and organization management</span>
                    </li>
                    <li className="flex items-center gap-3 text-warm-grey">
                      <Shield className="h-5 w-5 text-moss-green" />
                      <span>Role-based access control</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 animate-zoom-in">
                  <div className="w-full h-80 rounded-xl border-0 bg-gradient-to-br from-sky-blue/30 to-soft-lavender/20 flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-full flex-col items-center justify-center text-center p-6 animate-fade-in">
                      <div className="w-12 h-12 bg-sky-blue/50 rounded-2xl flex items-center justify-center mb-3 animate-rotate">
                        <Settings className="h-6 w-6 text-muted-teal animate-pulse" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-1 animate-slide-up">
                        Admin Dashboard
                      </h4>
                      <p className="text-xs text-warm-grey animate-slide-up animation-delay-100">
                        Powerful administration & reporting tools
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="h-4 bg-sky-blue/40 rounded-full animate-pulse animation-delay-0"></div>
                        <div className="h-4 bg-soft-lavender/60 rounded-full animate-pulse animation-delay-200"></div>
                        <div className="h-4 bg-muted-teal/40 rounded-full animate-pulse animation-delay-400"></div>
                        <div className="h-4 bg-moss-green/40 rounded-full animate-pulse animation-delay-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
              <Card className="bg-white border-0 shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-moss-green/20 rounded-2xl mb-6">
                    <Users className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Client Management
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Comprehensive client profiles with journey tracking,
                    interaction history, and progress monitoring all in one
                    place.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-dusty-rose/30 rounded-2xl mb-6">
                    <Calendar className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Event Coordination
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Streamline event planning, attendance tracking, and feedback
                    collection with integrated tools and automated workflows.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-soft-lavender rounded-2xl mb-6">
                    <Activity className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Real-time Analytics
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Live dashboards showing client progress, assessment
                    completion rates, and organizational impact metrics.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-blue/50 rounded-2xl mb-6">
                    <Shield className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Multi-Tenant Security
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Enterprise-grade security with role-based access control and
                    complete data isolation between organizations.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-peach-beige/50 rounded-2xl mb-6">
                    <Smartphone className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Mobile Optimized
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Fully responsive design ensures seamless access from any
                    device, perfect for field work and remote support.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-moss-green/30 rounded-2xl mb-6">
                    <Heart className="h-8 w-8 text-muted-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Journey Mapping
                  </h3>
                  <p className="text-warm-grey leading-relaxed">
                    Visual journey timelines help track client progress through
                    different stages of support with milestone tracking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Platform Overview Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-muted-teal/5 to-soft-lavender/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need in One Platform
              </h2>
              <p className="text-xl text-warm-grey max-w-3xl mx-auto">
                Streamline your perinatal care operations with integrated tools
                for client management, assessments, events, and reporting.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-muted-teal to-muted-teal/80 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <Users className="h-8 w-8" />
                    <h3 className="text-xl font-semibold">Client Dashboard</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-warm-grey">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Complete client profiles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Journey timeline tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Interaction history</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Progress monitoring</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-moss-green to-moss-green/80 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <FileText className="h-8 w-8" />
                    <h3 className="text-xl font-semibold">Assessment Hub</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-warm-grey">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>EPDS, WEMWBS, Outcome Star</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Custom assessment builder</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Automated scoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Risk alerts & triggers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-dusty-rose to-dusty-rose/80 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <Calendar className="h-8 w-8" />
                    <h3 className="text-xl font-semibold">Event Manager</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-warm-grey">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Event planning & scheduling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Attendance tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>Feedback collection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-moss-green" />
                      <span>QR code registration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Trusted by Care Organizations
              </h2>
              <p className="text-xl text-warm-grey max-w-3xl mx-auto">
                See how Thrive Perinatal is transforming the way organizations
                support families through their perinatal journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <Card className="bg-gradient-to-br from-soft-lavender/20 to-sky-blue/10 border-0 shadow-lg rounded-3xl p-10">
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
                    "Thrive gives our team gentle prompts when something needs
                    attention—it's like having an extra set of eyes on each
                    case. The journey mapping has transformed how we support our
                    families."
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

              <Card className="bg-gradient-to-br from-peach-beige/30 to-soft-coral/10 border-0 shadow-lg rounded-3xl p-10">
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
                    "The assessment library saves us hours each week, and the
                    outcome reports help us demonstrate real impact to our
                    funders. It's exactly what we needed."
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
        <section className="py-20 lg:py-32 bg-gradient-to-br from-muted-teal/10 to-soft-lavender/20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Ready to Transform Perinatal Care?
            </h2>
            <p className="text-xl text-warm-grey mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the organizations already using Thrive Perinatal to deliver
              better outcomes for families. Book a demo to see how we can
              support your team.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-muted-teal hover:bg-muted-teal/90 text-white text-lg px-10 py-4 rounded-xl h-auto shadow-lg hover:shadow-xl transition-all"
              >
                <a href="#demo">Book a Demo</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20 lg:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              See Thrive Perinatal in Action
            </h2>
            <p className="text-xl text-warm-grey mb-12 max-w-2xl mx-auto leading-relaxed">
              Book a free 30-minute demo to discover how Thrive Perinatal can
              support your team's mission. See real examples of journey tracking
              and outcome reporting.
            </p>

            <Card className="max-w-lg mx-auto bg-white border-0 shadow-2xl rounded-3xl">
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
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
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
                    href="#about"
                    className="text-warm-grey hover:text-muted-teal transition-colors"
                  >
                    About
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
