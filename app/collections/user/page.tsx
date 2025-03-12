"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "@/components/loader";

interface Collection {
  createdAt: Date;
  updatedAt: Date;
  collectionId: string;
  collectionName: string;
  collectionDesc: string;
  _count: {
    collectionCodats: number;
  };
}

const CollectionsPage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await axios.get(`/api/collections/user`);
        if (res.status === 200) {
          setCollections(res.data);
          //add toast for unauth
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching collections", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);

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
        setCollections((prev) => [...prev, res.data]);
        setShowPopup(false);
        setCollectionName("");
        setCollectionDesc("");
      } else {
        alert("Failed to add collections");
      }
    } catch (error) {
      console.error("Error adding collections", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold mb-6 text-center">
        Your Collections
      </h1>
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
              >
                Save
              </button>
              <button
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.length === 0 ? (
          <p className="text-gray-400 text-center col-span-2">
            No collections found.
          </p>
        ) : (
          collections.map((collection) => (
            <div
              key={collection.collectionId}
              className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 hover:border-white hover:shadow-glow transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {collection.collectionName}
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                {collection.collectionDesc}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {collection._count?.collectionCodats} Items
              </p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
                onClick={() =>
                  router.push(`/collections/${collection.collectionId}`)
                }
              >
                View Collection
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
