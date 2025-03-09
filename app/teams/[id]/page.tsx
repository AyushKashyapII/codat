"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface TeamMember {
  name: string | null;
  id: string;
  image: string | null;
}

interface TeamCollection {
  collectionId: string;
  collectionName: string;
}

interface Team {
  createdAt: Date;
  updatedAt: Date;
  teamId: string;
  teamName: string;
  teamOwner: TeamMember;
  teamMembers: TeamMember[];
  teamModerators: TeamMember[];
  teamCollections: TeamCollection[];
}

export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const id = params.id;
  
  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true);
        const response = await axios.get(`/api/teams/${id}`);
        if (response.status === 200) {
          setTeam(response.data);
        }
      } catch (err) {
        setError("Error fetching team data.");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, [id]);
  
  const handleAddCollection = async () => {
    if (!collectionName.trim()) return alert("Collection Name is required.");
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/teams/collections/${id}`, {
        collectionName,
        collectionDesc,
      });
      
      if (response.status === 200) {
        setTeam((prev) =>
          prev
            ? {
              ...prev,
              teamCollections: [
                ...prev.teamCollections,
                { collectionId: response.data.collectionId, collectionName },
              ],
            }
            : prev
        );
        setIsAddingCollection(false);
        setCollectionName("");
        setCollectionDesc("");
      }
    } catch (err) {
      alert("Error adding collection.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!team) return <p className="text-center text-gray-600">No team data available.</p>;
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">{team.teamName}</h1>
        <p className="text-gray-500 text-center mb-6">Team ID: {team.teamId}</p>
        
        {/* Team Owner */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Team Owner</h2>
          <div className="flex items-center gap-4 mt-2">
            <img
              src={team.teamOwner.image || "/default-avatar.png"}
              alt={team.teamOwner.name || "Owner"}
              className="w-12 h-12 rounded-full border"
            />
            <p className="text-gray-800">{team.teamOwner.name || "Unknown"}</p>
          </div>
        </div>
        
        {/* Team Moderators */}
        {team.teamModerators.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Moderators</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              {team.teamModerators.map((moderator) => (
                <div key={moderator.id} className="flex items-center gap-3">
                  <img
                    src={moderator.image || "/default-avatar.png"}
                    alt={moderator.name || "Moderator"}
                    className="w-10 h-10 rounded-full border"
                  />
                  <p className="text-gray-800">{moderator.name || "Unknown"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Team Members */}
        {team.teamMembers.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Members</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
              {team.teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <img
                    src={member.image || "/default-avatar.png"}
                    alt={member.name || "Member"}
                    className="w-10 h-10 rounded-full border"
                  />
                  <p className="text-gray-800">{member.name || "Unknown"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Team Collections */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">Team Collections</h2>
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setIsAddingCollection(true)}
            >
              + Add Collection
            </button>
          </div>
          {team.teamCollections.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {team.teamCollections.map((collection) => (
                <Link href={`/teams/collections/${collection.collectionId}`} key={collection.collectionId} className="text-gray-700">
                  - {collection.collectionName}
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No collections yet.</p>
          )}
        </div>
      </div>
      
      {/* Add Collection Modal */}
      {isAddingCollection && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Collection</h2>
            <input
              type="text"
              placeholder="Collection Name"
              className="w-full p-2 border rounded-md mb-3"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Collection Description"
              className="w-full p-2 border rounded-md mb-3"
              value={collectionDesc}
              onChange={(e) => setCollectionDesc(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                onClick={() => setIsAddingCollection(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isSubmitting}
                onClick={handleAddCollection}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
