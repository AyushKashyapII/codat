"use client"

import axios from "axios";
import {useState} from "react";

export default function AddCollection() {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  
  const handleAddCollection = async () => {
    if (!collectionName || !collectionDesc) {
      alert("collections name and description are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/collections/user", {
        collectionName,
        collectionDesc,
      });
      if (res.status === 200) {
        window.location.reload();
      } else {
        alert("Failed to add collections");
      }
    } catch (error) {
      console.error("Error adding collections", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <button
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:from-purple-500 hover:to-blue-500 transition-transform transform hover:scale-105 mb-6"
        onClick={() => setShowPopup(true)}
      >
        + Add Collection
      </button>
      
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">
              Add Collection
            </h2>
            <input
              type="text"
              placeholder="Collection Name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Collection Description"
              value={collectionDesc}
              onChange={(e) => setCollectionDesc(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-between">
              <button
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
                onClick={handleAddCollection}
                disabled={loading}
              >
                Save
              </button>
              <button
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition"
                onClick={() => setShowPopup(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}