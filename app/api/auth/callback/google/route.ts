import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForTokens,
  getGoogleUserInfo,
  setupGmailWatch,
} from "@/lib/google-oauth";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      `${appUrl}/login?error=${encodeURIComponent(error)}`
    );
  }

  // Ensure we have an authorization code
  if (!code) {
    console.error("No authorization code received");
    return NextResponse.redirect(
      `${appUrl}/login?error=${encodeURIComponent("No authorization code")}`
    );
  }

  try {
    // Step 1: Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.access_token) {
      throw new Error("Missing access_token");
    }

    // Step 2: Get user info from Google
    const userInfo = await getGoogleUserInfo(tokens.access_token);

    if (!userInfo.email) {
      throw new Error("Could not retrieve user email");
    }

    // Step 2.5: If no refresh_token, check if we have one stored (returning user)
    const supabase = createServerClient();
    let refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      const { data: existingUser } = await supabase
        .from("gmail_accounts")
        .select("google_refresh_token")
        .eq("email", userInfo.email)
        .single();

      if (existingUser?.google_refresh_token) {
        refreshToken = existingUser.google_refresh_token;
      } else {
        // New user but no refresh_token - this shouldn't happen normally
        // Redirect to login with a prompt to re-authorize
        return NextResponse.redirect(
          `${appUrl}/login?error=${encodeURIComponent("Please sign in again to complete setup")}&reauth=true`
        );
      }
    }

    // Step 3: Check if existing account and whether we process emails (decide before storing)
    const { data: existingAccount } = await supabase
      .from("gmail_accounts")
      .select("id, process_emails")
      .eq("email", userInfo.email)
      .maybeSingle();

    // Only set up Gmail watch for accounts that process emails (new users get process_emails true below)
    const shouldSetupWatch = refreshToken && (!existingAccount || existingAccount.process_emails);
    let watchData: { historyId: string | null; expiration: string | null } = {
      historyId: null,
      expiration: null,
    };
    if (shouldSetupWatch) {
      try {
        const result = await setupGmailWatch(
          tokens.access_token,
          refreshToken
        );
        watchData = {
          historyId: result.historyId ?? null,
          expiration: result.expiration ?? null,
        };
      } catch (watchError) {
        // Log but don't fail - watch can be set up later
        console.error("Failed to set up Gmail watch:", watchError);
      }
    }

    // Step 4: Store user data in Supabase

    // Calculate watch expiry date (Google returns milliseconds)
    const watchExpiry = watchData.expiration
      ? new Date(parseInt(watchData.expiration)).toISOString()
      : null;

    const basePayload = {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      google_access_token: tokens.access_token,
      google_refresh_token: refreshToken,
      google_token_expiry: tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null,
      gmail_history_id: watchData.historyId,
      gmail_watch_expiry: watchExpiry,
      updated_at: new Date().toISOString(),
    };

    if (existingAccount) {
      const { error: updateError } = await supabase
        .from("gmail_accounts")
        .update(basePayload)
        .eq("email", userInfo.email);
      if (updateError) {
        console.error("Supabase error updating user data:", updateError);
        const msg = updateError.message || "Failed to save user data";
        throw new Error(msg);
      }
    } else {
      // First-time registration: create organisation and set process_emails true
      const orgName = userInfo.name?.trim() || userInfo.email?.split("@")[0] || "My organisation";
      const { data: newOrg, error: orgError } = await supabase
        .from("organizations")
        .insert({ name: orgName })
        .select("id")
        .single();
      if (orgError || !newOrg?.id) {
        console.error("Supabase error creating organisation:", orgError);
        throw new Error(orgError?.message || "Failed to create organization");
      }
      const { error: insertError } = await supabase
        .from("gmail_accounts")
        .insert({
          ...basePayload,
          organization_id: newOrg.id,
          process_emails: true,
        });
      if (insertError) {
        console.error("Supabase error inserting user data:", insertError);
        const msg = insertError.message || "Failed to save user data";
        throw new Error(msg);
      }
    }

    // Step 5: Create a session token (simple approach - you may want to use JWT)
    // For now, we'll use a simple cookie with the user's email
    const response = NextResponse.redirect(`${appUrl}/dashboard`);

    // Set a session cookie (HttpOnly for security)
    response.cookies.set("booksmart_session", userInfo.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Authentication failed";
    // Include full message in redirect so you can see e.g. "null value in column organization_id"
    return NextResponse.redirect(
      `${appUrl}/login?error=${encodeURIComponent(errorMessage)}`
    );
  }
}
