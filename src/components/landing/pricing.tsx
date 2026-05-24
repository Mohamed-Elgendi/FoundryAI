/**
 * Landing Page Pricing Section
 *
 * 3-tier pricing table.
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { STRIPE_PLANS } from "@/lib/constants";
import Link from "next/link";

const PLANS = [
  {
    ...STRIPE_PLANS.free,
    popular: false,
  },
  {
    ...STRIPE_PLANS.pro,
    popular: true,
  },
  {
    ...STRIPE_PLANS.enterprise,
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="bg-muted/50 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.price === 0 ? "Free forever" : `$${(plan.price / 100).toFixed(0)}/month`}
                </CardDescription>
                <div className="mt-2">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? "$0" : `$${(plan.price / 100).toFixed(0)}`}
                  </span>
                  {('interval' in plan && plan.interval) && (
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {[...plan.features].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-4 w-4 shrink-0 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="/sign-up">
                    {plan.price === 0 ? "Get Started" : "Start Free Trial"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
