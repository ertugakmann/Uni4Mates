"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// User type definition
type User = {
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  bio?: string;
  username?: string;
  nationality?: string;
};

const Profile = () => {
  const { id: clientId } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    profilePicture: null as File | null,
    gender: "",
    username: "",
    nationality: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    if (clientId) {
      fetchUser();
    }
  }, [clientId]);

  // Fetch user details from API
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/getUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const { user: fetchedUser } = await res.json();
      setUser(fetchedUser);
      setFormData({
        firstName: fetchedUser.firstName || "",
        lastName: fetchedUser.lastName || "",
        email: fetchedUser.email || "",
        bio: fetchedUser.bio || "",
        profilePicture: null,
        gender: fetchedUser.gender || "",
        username: fetchedUser.username || "",
        nationality: fetchedUser.nationality || "",
      });
    } catch (error) {
      console.error(error instanceof Error);
    }
  };

  // Update profile data in Firestore
  const updateProfile = async () => {
    try {
      const res = await fetch(`/api/user/updateUser/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, clientId }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Profile update failed");

      console.log("Profile updated successfully");
    } catch (error) {
      console.error(error instanceof Error);
    }
  };

  // Handle form input changes dynamically
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, profilePicture: file }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center p-6 w-1/3 border-r">
          <div className="relative">
            <img
              src={
                formData.profilePicture
                  ? URL.createObjectURL(formData.profilePicture)
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
              onChange={handleFileChange}
            />
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-800">
            {formData.firstName} {formData.lastName}
          </h1>
          <p className="text-sm text-gray-500">{formData.email}</p>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Username */}
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
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            {/* Nationality */}
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
                value={formData.nationality}
                onChange={handleInputChange}
                list="nationalityOptions"
              />
              <datalist id="nationalityOptions">
                <option value="Turkey" />
                <option value="Turkmenistan" />
                <option value="Turks and Caicos Islands" />
                <option value="Tanzania" />
              </datalist>
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-900"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Bio */}
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
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Submit Button */}
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
