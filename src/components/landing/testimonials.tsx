/**
 * Landing Page Testimonials Section
 *
 * 3 testimonial cards with quotes.
 */

import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    quote: "FoundryAI has completely transformed how I create lesson plans. The AI curriculum builder saves me hours every week.",
    name: "Sarah Chen",
    role: "High School Teacher",
    avatar: "SC",
  },
  {
    quote: "The progress analytics help me identify struggling students early and intervene before it&apos;s too late. Game changer.",
    name: "Mike Rodriguez",
    role: "University Professor",
    avatar: "MR",
  },
  {
    quote: "Enterprise features are top-notch. SSO, custom branding, and dedicated support make it perfect for our district.",
    name: "Emily Watson",
    role: "EdTech Director",
    avatar: "EW",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by Educators
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join thousands of teachers who trust FoundryAI.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardContent className="pt-6">
                <div className="mb-4 text-3xl text-primary/40">&ldquo;</div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
