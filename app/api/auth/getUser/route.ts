import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { clientId } = await req.json();

  console.log("apiden id", clientId);

  await dbConnect();

  // Eğer MongoDB'de id'yi _id olarak saklıyorsanız, arama şu şekilde yapılmalı:
  const user = await User.findOne({ _id: clientId });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      message: "User find successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        nationality: user.nationality,
        bio: user.bio,
        gender: user.gender,
        instagram: user.instagram,
      },
    },
    { status: 200 }
  );
}
