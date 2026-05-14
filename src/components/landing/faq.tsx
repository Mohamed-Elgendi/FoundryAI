/**
 * Landing Page FAQ Section
 *
 * Accordion with 6 Q&As.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "What is FoundryAI?",
    answer: "FoundryAI is an AI-powered educational platform that helps teachers create structured curriculums, manage courses, track student progress, and build engaging learning experiences — all in one place.",
  },
  {
    question: "How does AI curriculum generation work?",
    answer: "Our AI analyzes your guide parameters — topic, difficulty, target audience, and duration — to generate a complete, structured curriculum with lessons, exercises, quizzes, and projects. You can review and edit everything before publishing.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes! Our Free plan includes up to 3 guides, basic analytics, and community support. It's perfect for getting started and testing the platform.",
  },
  {
    question: "Can I export my guides?",
    answer: "Yes, you can export guides as PDF or JSON files. Pro and Enterprise plans also support LMS integrations via SCORM and xAPI standards.",
  },
  {
    question: "What about data privacy?",
    answer: "We use enterprise-grade encryption at rest and in transit. We're GDPR compliant and never share your data with third parties. Student data is fully isolated and accessible only to authorized teachers.",
  },
  {
    question: "How do I upgrade my plan?",
    answer: "Navigate to Settings &gt; Billing from your dashboard. You can upgrade, downgrade, or cancel at any time. Changes take effect immediately, and we'll prorate billing automatically.",
  },
];

export function FAQ() {
  return (
    <section className="bg-muted/50 px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about FoundryAI.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
