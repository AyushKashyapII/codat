"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Plus,
  Search,
  Users,
  Shield,
  UserPlus,
  ChevronRight,
} from "lucide-react";

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

  const getTeamColor = (teamId: string) => {
    const colors = [
      "#3E95FF",
      "#FF5252",
      "#4CAF50",
      "#9C27B0",
      "#FF9800",
      "#009688",
      "#E91E63",
      "#3F51B5",
    ];

    const index =
      teamId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-[#0F1220] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teams</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#3E95FF] text-white rounded-md hover:bg-[#3384E3] transition flex items-center"
          >
            <Plus size={18} className="mr-2" /> Create Team
          </button>
        </div>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-3 bg-[#1A2035] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#3E95FF] focus:border-transparent transition"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3E95FF]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => {
                const teamColor = getTeamColor(team.teamId);
                return (
                  <div
                    key={team.teamId}
                    className="bg-[#1A2035] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group"
                  >
                    <div
                      className="h-2"
                      style={{ backgroundColor: teamColor }}
                    ></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold">{team.teamName}</h2>
                        <div
                          className="rounded-full h-10 w-10 flex items-center justify-center"
                          style={{ backgroundColor: `${teamColor}30` }}
                        >
                          <Users size={20} style={{ color: teamColor }} />
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-gray-400">
                          <Shield size={16} className="mr-2" />
                          <span>Role: </span>
                          <span className="ml-2 text-white">
                            {team.role || "Member"}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-400">
                          <UserPlus size={16} className="mr-2" />
                          <span>Members: </span>
                          <span className="ml-2 text-white">
                            {team.teamMembers.length}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-400">
                          <Shield size={16} className="mr-2" />
                          <span>Moderators: </span>
                          <span className="ml-2 text-white">
                            {team.teamModerators.length}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/teams/${team.teamId}`}
                        className="mt-6 flex items-center justify-center w-full p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-md transition-colors group-hover:bg-opacity-80"
                        style={{ color: teamColor }}
                      >
                        View Team
                        <ChevronRight
                          size={18}
                          className="ml-2 transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-[#1A2035] rounded-lg p-8 text-center">
                <Users size={48} className="mx-auto mb-4 text-gray-500" />
                <h2 className="text-xl font-semibold mb-2">No teams found</h2>
                <p className="text-gray-400 mb-4">
                  {search ? "Try a different search term or" : "Get started by"}{" "}
                  creating a new team
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-[#3E95FF] text-white rounded-md hover:bg-[#3384E3] transition inline-flex items-center"
                >
                  <Plus size={18} className="mr-2" /> Create Team
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-[#1A2035] p-6 rounded-lg shadow-lg w-96 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
            <input
              type="text"
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full p-3 bg-[#141B2D] border border-gray-700 rounded-md focus:ring-2 focus:ring-[#3E95FF] focus:border-transparent"
              autoFocus
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewTeamName("");
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeam}
                className="px-4 py-2 bg-[#3E95FF] text-white rounded-md hover:bg-[#3384E3] transition"
                disabled={!newTeamName.trim()}
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
