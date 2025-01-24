import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import { hashPassword } from "@/app/lib/password";

export async function POST(req: Request) {
  const {
    firstName,
    lastName,
    email,
    password,
    username,
    gender,
    nationality,
    bio,
  } = await req.json();

  try {
    await dbConnect();

    // User Control
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 422 }
      );
    }

    // Password Hashing and Creating User
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      username,
      gender,
      nationality,
      bio,
    });

    return NextResponse.json({ message: "User created", user: newUser });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
