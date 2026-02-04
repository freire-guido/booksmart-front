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

    // Step 3: Set up Gmail watch for push notifications
    let watchData: { historyId: string | null; expiration: string | null } = {
      historyId: null,
      expiration: null,
    };
    if (refreshToken) {
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

    // Upsert Gmail account data
    const { error: dbError } = await supabase.from("gmail_accounts").upsert(
      {
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
      },
      { onConflict: "email" }
    );

    if (dbError) {
      console.error("Supabase error:", dbError);
      throw new Error("Failed to save user data");
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
    return NextResponse.redirect(
      `${appUrl}/login?error=${encodeURIComponent(errorMessage)}`
    );
  }
}
