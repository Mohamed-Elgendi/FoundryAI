/**
 * Auth Callback Page
 * 
 * Handles OAuth and email verification callbacks from Supabase.
 * Processes authorization codes and redirect URLs.
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const supabase = await createSupabaseServerClient(cookieStore);

  // Check for auth error in URL
  const url = typeof window !== "undefined" ? window.location.href : "";
  const error = !url.includes("#access_token=") ? undefined : null;

  // Redirect based on auth type
  if (params.type === "invite") {
    return redirect("/teacher/dashboard");
  }

  if (params.type === "signup" || params.type === "magiclink") {
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Determine role and redirect
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "teacher") {
        return redirect("/teacher/dashboard");
      }
      return redirect("/student/dashboard");
    }
  }

  // Default redirect to sign-in if no auth state
  return redirect("/sign-in");
}
