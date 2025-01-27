import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

export async function PUT(req: NextRequest) {
  const {
    bio,
    profilePicture,
    gender,
    clientId,
    nationality,
    username,
    instagram,
  } = await req.json();

  try {
    await dbConnect();

    // Kullanıcıyı veritabanında arıyoruz
    const user = await User.findOne({ _id: clientId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Kullanıcı bilgilerini güncelliyoruz
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
    if (nationality) user.nationality = nationality;
    if (username) user.username = username;
    if (instagram) user.instagram = instagram;

    // Değişiklikleri kaydediyoruz
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user,
      clientId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
