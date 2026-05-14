/**
 * Landing Page Features Section
 *
 * 6 feature cards in a responsive grid.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22" />
        <path d="M8 6a4 4 0 0 1 .65-2.18" />
        <path d="M17 12.5c1.77.74 3 2.54 3 4.62A5.13 5.13 0 0 1 14.88 22" />
        <path d="M7 12.5A5.13 5.13 0 0 0 2 17.12c0 2.08 1.23 3.88 3 4.62" />
        <path d="M12 12V6" />
      </svg>
    ),
    title: "AI Curriculum Builder",
    description: "Generate structured curriculums powered by AI in minutes. Specify your topic, difficulty, and target audience.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    title: "Progress Analytics",
    description: "Track student progress with detailed insights and charts. Identify struggling students early.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
    title: "Smart Assignments",
    description: "Create and manage assignments with automated grading. Set deadlines and track submissions.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Team Collaboration",
    description: "Work together with your team on guides and courses. Share resources and coordinate curriculum.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <path d="M12 6h4" />
        <path d="M8 18h8" />
      </svg>
    ),
    title: "Multi-Platform",
    description: "Access your learning materials anywhere, anytime. Responsive design for desktop, tablet, and mobile.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Secure & Private",
    description: "Enterprise-grade security with encryption at rest and in transit. GDPR compliant infrastructure.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Teach Better
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Powerful features designed to save you time and improve student outcomes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-2 text-primary">{feature.icon}</div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
