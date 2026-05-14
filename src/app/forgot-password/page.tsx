/**
 * Forgot Password Page
 * 
 * Allows users to request a password reset email via Supabase Auth.
 */

"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?type=signup`,
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email and we&apos;ll send you a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "sent" ? (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>
                <p>Check your email for the password reset link.</p>
                <p className="mt-2 text-sm">
                  It may take a minute to arrive. Check your spam folder if you don&apos;t see it.
                </p>
                <Button
                  variant="link"
                  className="mt-2 p-0"
                  onClick={() => setStatus("idle")}
                >
                  Try another email
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "sending"}
                />
              </div>

              {status === "error" && (
                <Alert variant="destructive">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={status === "sending" || !email}
              >
                {status === "sending" ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/sign-in" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">
            Back to Sign In
          </Link>
          <Link href="/sign-up" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">
            Create Account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
