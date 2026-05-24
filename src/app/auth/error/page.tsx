/**
 * Auth Error Page
 * 
 * Displays a user-friendly error message when authentication fails.
 */

"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Map common auth error codes to user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  "access_denied": "You denied access. Please try again.",
  "invalid_grant": "The authentication code has expired or is invalid. Please try again.",
  "email_exists": "An account with this email already exists.",
  "invalid_credentials": "Invalid email or password. Please try again.",
  "user_suspended": "Your account has been suspended. Contact support.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "unknown";
  const message = ERROR_MESSAGES[errorCode] || "An authentication error occurred. Please try again.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-red-600">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-center">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Error code: <code className="font-mono">{errorCode}</code>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/sign-in" className="w-full">
            <Button className="w-full">
              Try Signing In Again
            </Button>
          </Link>
          <Link href="/sign-up" className="w-full">
            <Button variant="outline" className="w-full">
              Create New Account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
