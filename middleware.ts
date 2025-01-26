import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./app/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value; // Take the token from cookies
  const url = req.nextUrl.clone();

  // If the token is not present, redirect to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Verify the token
  const user = await decrypt(token);

  if (!user) {
    url.pathname = "/login";
    return NextResponse.redirect(url); // Token geçersizse girişe yönlendir
  }

  return NextResponse.next(); // Give access to the route
}

// Work in just profile paths
export const config = {
  matcher: "/profile/:path*",
};
