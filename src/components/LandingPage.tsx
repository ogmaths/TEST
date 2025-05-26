import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Social Impact Tracker</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("about")}
              className={activeTab === "about" ? "font-medium" : ""}
            >
              About
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("pricing")}
              className={activeTab === "pricing" ? "font-medium" : ""}
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("contact")}
              className={activeTab === "contact" ? "font-medium" : ""}
            >
              Contact
            </Button>
            <Button asChild variant="default">
              <Link to="/login">Login</Link>
            </Button>
          </nav>
          <div className="md:hidden">
            <Button variant="outline" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Track Your Social Impact
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Measure, analyze, and report on your organization's social
                  impact with our comprehensive tracking platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link to="#" onClick={() => setActiveTab("about")}>
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="container px-4 md:px-6 py-8"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="about">About Us</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* About Us Tab */}
          <TabsContent value="about" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground">
                  We believe that measuring social impact should be accessible
                  to all organizations. Our platform helps you track, analyze,
                  and report on your social impact initiatives, making it easier
                  to demonstrate your value to stakeholders and improve your
                  programs.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="text-muted-foreground">
                  Founded in 2020, Social Impact Tracker was born out of the
                  need for better tools to measure social impact. We've worked
                  with hundreds of organizations to develop a platform that
                  meets the unique needs of social impact organizations.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Platform</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Track client journeys, assessments, and outcomes in one
                      place.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Event Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Manage events, attendance, and participant feedback
                      seamlessly.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Reporting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Generate comprehensive reports to demonstrate your social
                      impact.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Choose the plan that's right for your organization. All plans
                include our core features.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Starter Plan */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>
                    For small organizations just getting started
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-3xl font-bold mb-4">
                    £49<span className="text-sm font-normal">/month</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>Up to 100 clients</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>Basic reporting</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>2 user accounts</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Professional Plan */}
              <Card className="flex flex-col border-primary">
                <CardHeader>
                  <div className="text-center bg-primary text-primary-foreground py-1 px-4 rounded-full text-sm font-medium w-fit mx-auto -mt-8 mb-2">
                    Most Popular
                  </div>
                  <CardTitle>Professional</CardTitle>
                  <CardDescription>
                    For growing organizations with more complex needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-3xl font-bold mb-4">
                    £99<span className="text-sm font-normal">/month</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>Up to 500 clients</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>Advanced reporting</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>5 user accounts</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>Custom assessments</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>
                    For large organizations with custom requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-3xl font-bold mb-4">Custom</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>Unlimited clients</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>Custom reporting</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>Unlimited user accounts</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>API access</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>Dedicated support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Have questions about our platform? Want to schedule a demo?
                  We're here to help.
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">
                    contact@socialimpacttracker.com
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+44 (0) 123 456 7890</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">
                    123 Impact Street, London, UK
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Contact Form</h2>
                <form className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="first-name"
                          className="text-sm font-medium"
                        >
                          First name
                        </label>
                        <input
                          id="first-name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="last-name"
                          className="text-sm font-medium"
                        >
                          Last name
                        </label>
                        <input
                          id="last-name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="organization"
                        className="text-sm font-medium"
                      >
                        Organization
                      </label>
                      <input
                        id="organization"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your organization"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us how we can help..."
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-14">
          <p className="text-sm text-muted-foreground">
            © 2024 Social Impact Tracker. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
