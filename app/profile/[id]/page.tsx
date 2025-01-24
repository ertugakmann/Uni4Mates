"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  bio?: string;
  username?: string;
};

type FormData = {
  bio: string;
  profilePicture: File | null;
  gender: string;
  username: string;
};

const Profile = () => {
  const params = useParams();
  const clientId = params.id;

  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [gender, setGender] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [nationality, setNationality] = useState<string>("");

  const formData: FormData = {
    bio,
    profilePicture,
    gender,
    username,
  };

  useEffect(() => {
    if (clientId) fetchUser();
  }, [clientId]);

  const fetchUser = async () => {
    const res = await fetch("/api/auth/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientId }),
    });
    if (!res.ok) {
      console.error("User not found");
      return;
    }

    const userData = await res.json();

    setUser(userData.user);
    setFirstName(userData.user.firstName);
    setLastName(userData.user.lastName);
    setEmail(userData.user.email);
    setBio(userData.user.bio);
    setGender(userData.user.gender);
    setUsername(userData.user.username);
    setNationality(userData.user.nationality);
  };

  const updateProfile = async () => {
    const res = await fetch(`/api/user/updateUser/${clientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId,
        bio,
        profilePicture,
        gender,
        username,
        nationality,
      }),
    });

    const data = await res.json();
    if (data.success) {
      console.log("Profile updated successfully");
    } else {
      console.error("Profile update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center p-6 w-1/3 border-r">
          <div className="relative">
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover hover:shadow-lg hover:opacity-90 cursor-pointer"
              onClick={() =>
                document.getElementById("profilePictureInput")?.click()
              }
            />
            <input
              id="profilePictureInput"
              type="file"
              className="hidden"
              onChange={(e) => setProfilePicture(e.target.files?.[0] ?? null)}
            />
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-800">
            {firstName} {lastName}
          </h1>
          <p className="text-sm text-gray-500">{email}</p>
        </div>

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="nationality"
                className="block text-sm font-medium text-gray-900"
              >
                Nationality
              </label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                list="nationalityOptions"
              />
              <datalist id="nationalityOptions">
                <option value="Turkey" />
                <option value="Turkmenistan" />
                <option value="Turks and Caicos Islands" />
                <option value="Tanzania" />
              </datalist>
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-900"
              >
                Gender
              </label>
              <select
                id="gender"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-900"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={(e) => {
                e.preventDefault();
                updateProfile();
              }}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
