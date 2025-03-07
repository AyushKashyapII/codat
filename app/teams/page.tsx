"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Team {
  role: string;
  teamId: string;
  teamName: string;
  teamOwnerId: string;
  teamMembers: { id: string }[];
  teamModerators: { id: string }[];
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/teams");
      if (response.status === 200) {
        setTeams(response.data);
        setFilteredTeams(response.data);
      }
    } catch {
      setError("Failed to load teams.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTeams();
  }, []);
  
  
  useEffect(() => {
    setFilteredTeams(
      teams.filter((team) =>
        team.teamName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, teams]);
  
  const handleAddTeam = async () => {
    if (!newTeamName.trim()) return;
    
    try {
      const res = await axios.post("/api/teams", { teamName: newTeamName });
      if (res.status === 200) {
        setIsModalOpen(false);
        setNewTeamName("");
        fetchTeams();
      }
    } catch {
      alert("Failed to add team.");
    }
  };
  
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Teams</h1>
        
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Add Team
          </button>
        </div>
        
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {!loading && !error && (
          <div className="space-y-4">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <div key={team.teamId} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-700">{team.teamName}</h2>
                  <p className="text-sm text-gray-500">Role: {team.role}</p>
                  <p className="text-sm text-gray-500">Owner ID: {team.teamOwnerId}</p>
                  <p className="text-sm text-gray-500">Members: {team.teamMembers.length}</p>
                  <p className="text-sm text-gray-500">Moderators: {team.teamModerators.length}</p>
                  <Link href={`/teams/${team.teamId}`} className="text-blue-700">view team</Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No teams found.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Add Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Team</h2>
            <input
              type="text"
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeam}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Add Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
