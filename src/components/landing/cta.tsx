/**
 * Landing Page CTA Section
 *
 * Final call-to-action banner.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to Transform Your Teaching?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Join thousands of educators who are already using AI to create better learning experiences.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/sign-up">Start Free Today</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
