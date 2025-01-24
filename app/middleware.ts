import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

export async function middleware(req: Request) {
  // Get the token from the Authorization header
  const token = req.headers.get("Authorization")?.split(" ")[1];

  // If there's no token, return a 401 Unauthorized response
  if (!token) {
    return NextResponse.json(
      { message: "Authorization token missing" },
      { status: 401 }
    );
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "secret") as jwt.JwtPayload; // Cast to JwtPayload

    // Check if the decoded token contains the user ID
    if (!decoded.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Find the user by the ID in the token

    // Attach the user to the request (can be used later if needed)

    // Token verified, continue processing
    return NextResponse.next();
  } catch (error) {
    // If the token is invalid or there's another error, return a 401 response
    return NextResponse.json(
      { message: "Invalid token", error: error },
      { status: 401 }
    );
  }
}

// Define which paths the middleware should apply to
export const config = {
  matcher: ["/api/protected/*"], // For example, this applies only to protected endpoints
};
