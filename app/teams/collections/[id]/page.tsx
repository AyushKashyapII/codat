"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface Codat {
  codatId: string;
  codatName: string;
  codatAuthor: {
    id: string;
    name: string;
    image: string;
  };
}

interface Collection {
  createdAt: Date;
  updatedAt: Date;
  collectionName: string;
  collectionDesc: string;
  _count: {
    collectionCodats: number;
  };
  collectionOwner: {
    name: string | null;
    id: string;
    image: string | null;
  };
  collectionCodats: Codat[];
}

export default function CollectionPage() {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params.id;
  
  useEffect(() => {
    async function fetchCollection() {
      try {
        setLoading(true);
        const response = await axios.get(`/api/teams/collections/${id}`);
        if (response.status === 200) {
          setCollection(response.data);
        }
      } catch (err) {
        setError("Error fetching collection data.");
      } finally {
        setLoading(false);
      }
    }
    fetchCollection();
  }, [id]);
  
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!collection) return <p className="text-center text-gray-600">No collection data available.</p>;
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">{collection.collectionName}</h1>
        <p className="text-gray-500 text-center">{collection.collectionDesc}</p>
        
        {/* Owner */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Collection Owner</h2>
          <div className="flex items-center gap-4 mt-2">
            <img
              src={collection.collectionOwner.image || "/default-avatar.png"}
              alt={collection.collectionOwner.name || "Owner"}
              className="w-12 h-12 rounded-full border"
            />
            <p className="text-gray-800">{collection.collectionOwner.name || "Unknown"}</p>
          </div>
        </div>
        
        {/* Codats */}
        {collection.collectionCodats.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Codats</h2>
            <ul className="mt-2 space-y-2">
              {collection.collectionCodats.map((codat) => (
                <li key={codat.codatId} className="flex items-center gap-4 text-gray-700">
                  <img
                    src={codat.codatAuthor.image || "/default-avatar.png"}
                    alt={codat.codatAuthor.name || "Author"}
                    className="w-8 h-8 rounded-full border"
                  />
                  <p className="font-medium">{codat.codatName}</p>
                  <span className="text-sm text-gray-500">by {codat.codatAuthor.name || "Unknown"}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Add Codat Button */}
        <div className="mt-6 text-center">
          <Link
            href={`../../../codat/add/${id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add Codat
          </Link>
        </div>
      </div>
    </div>
  );
}
