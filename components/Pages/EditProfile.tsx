'use client';

import { useModel } from "@/hooks/user-model-store";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface EditProfileProps {
  name: string;
  phoneNumber: string;
  image: string;
  email: string;
}

export default function EditProfile({
  name: initialName,
  phoneNumber: initialPhoneNumber,
  image: initialImage,
  email,
}: EditProfileProps) {
  const { setEditProfile } = useModel();
  const [name, setName] = useState(initialName || "");
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || "");
  const [image, setImage] = useState(initialImage || "");

  const handleUpdateProfile = async () => {
    try {
      const { data } = await axios.put("/api/profile/edit", {
        name,
        phoneNumber,
        image,
      });

      setEditProfile(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      {/* Email (Read-only) */}
      <div className="mb-4">
        <label className="block font-medium">Email:</label>
        <input
          type="text"
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          value={email}
          readOnly
        />
      </div>

      {/* Editable Fields */}
      <div className="mb-4">
        <label className="block font-medium">Name:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Phone Number:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Profile Image:</label>
        <img src={image}/>
      </div>

      

      {/* Save Button */}
      <button
        onClick={handleUpdateProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}
