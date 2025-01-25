"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, Fragment } from "react";
import DefaultAvatar from "../../../public/assets/profile/default-avatar.png";
import { Combobox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import country from "../../../countries.json";

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

  const [query, setQuery] = useState("");
  const filteredCountry =
    query === ""
      ? country // Display all countries if query is empty
      : country.filter((country) =>
          country.name.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    if (clientId) {
      fetchUser();
    }
  }, [clientId]);

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
      console.log(formData.nationality);
    } catch (error) {
      console.error(error instanceof Error);
    }
  };

  const updateProfile = async () => {
    try {
      const res = await fetch(`/api/user/updateUser/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          nationality: formData.nationality.name, // Ensure only the country name is sent
          clientId,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Profile update failed");

      console.log("Profile updated successfully");
    } catch (error) {
      console.error(error instanceof Error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      formData.append(
        "clientId",
        Array.isArray(clientId) ? clientId[0] : clientId || ""
      );

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          profilePicture: data.fileUrl,
        }));
        console.log("Profile picture uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Error uploading file"
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      uploadProfilePicture(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center p-6 w-1/3 border-r">
          <div className="relative">
            <img
              src={
                typeof formData.profilePicture === "string"
                  ? formData.profilePicture
                  : DefaultAvatar.src
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
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label
                htmlFor="nationality"
                className="block text-sm font-medium text-gray-900"
              >
                Nationality
              </label>
              <Combobox
                value={formData.nationality}
                onChange={(value) => {
                  if (value) {
                    setFormData((prev) => ({ ...prev, nationality: value }));
                  }
                  setQuery(""); // Clear the query when a nationality is selected
                }}
              >
                <div className="relative mt-1 z-10">
                  <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-[whitesmoke] focus:ring-0"
                      displayValue={(country: { name: string }) =>
                        country?.name || formData.nationality
                      } // Display user's nationality as default value
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    </Combobox.Button>
                  </div>

                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredCountry.length === 0 && query !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredCountry.map((country) => (
                        <Combobox.Option
                          key={country.name}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-teal-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={country}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {country.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-teal-600"
                                  }`}
                                >
                                  <CheckIcon className="h-5 w-5" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </div>
              </Combobox>
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
                name="gender"
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
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
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <button
                type="button"
                onClick={updateProfile}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
