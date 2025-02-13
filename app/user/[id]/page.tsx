"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/loader";
import { Users, Shield, Crown, User } from 'lucide-react';
import Link from "next/link";

interface Team {
  teamId: string;
  teamName: string;
}

interface Collection {
  collectionId: string;
  collectionName: string;
  _count: { collectionCodats: number };
}

interface Profile {
  name: string | null;
  id: string;
  image: string | null;
  teamsPartsOf: Team[];
  teamsOwnerOf: Team[];
  teamsModeratorOf: Team[];
  codatsCollections: Collection[];
  usersFollowing: { id: string }[];
  _count: {
    usersFollowing: number;
    usersFollowed: number;
    codatsCollections: number;
    codatsAuthored: number;
    teamsPartsOf: number;
    teamsModeratorOf: number;
    teamsOwnerOf: number;
  };
}

const UserProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/user/${id}`);
        if (res.status === 200) {
          setProfile(res.data);
          setIsFollowing(res.data.usersFollowing.length > 0);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        const res = await axios.delete(`http://localhost:3000/api/followings/${id}`);
        if (res.status === 200) {
          setIsFollowing(false);
        }
      } else {
        const res = await axios.post(`http://localhost:3000/api/followings/${id}`);
        if (res.status === 200) {
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error("Error updating follow status", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!profile) return <p className="text-gray-400">User not found.</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Banner & Profile Info */}
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-8">
            <div className="relative w-32 h-32 rounded-full bg-gray-700 overflow-hidden ring-4 ring-gray-800">
              {profile.image ? (
                <img src={profile.image} alt={profile.name ?? ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                  {profile.name}
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold">{profile.name || 'Anonymous'}</h1>
              <p className="text-gray-400 mt-2">ID: {profile.id}</p>
            </div>
            <button
              onClick={handleFollowToggle}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                isFollowing
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Following', value: profile._count.usersFollowing, icon: "👥" },
            { label: 'Followers', value: profile._count.usersFollowed, icon: "👥" },
            { label: 'Collections', value: profile._count.codatsCollections, icon: "📚" },
            { label: 'Authored', value: profile._count.codatsAuthored, icon: "✍️" },
          ].map((stat) => (
            <div key={stat.label}
                 className="bg-gray-800 rounded-xl p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Teams Section */}
          <div className="bg-gray-800 rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Team Memberships
            </h2>

            {/* Owner Teams */}
            {profile.teamsOwnerOf.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center text-yellow-400">
                  <Crown className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Owner</h3>
                </div>
                <div className="grid gap-2">
                  {profile.teamsOwnerOf.map((team) => (
                    <div key={team.teamId}
                         className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                      {team.teamName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Moderator Teams */}
            {profile.teamsModeratorOf.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center text-blue-400">
                  <Shield className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Moderator</h3>
                </div>
                <div className="grid gap-2">
                  {profile.teamsModeratorOf.map((team) => (
                    <div key={team.teamId}
                         className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                      {team.teamName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Teams */}
            {profile.teamsPartsOf.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center text-green-400">
                  <Users className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Member</h3>
                </div>
                <div className="grid gap-2">
                  {profile.teamsPartsOf.map((team) => (
                    <div key={team.teamId}
                         className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                      {team.teamName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Collections Section */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-2xl mr-2">📚</span>
              Collections
            </h2>
            <div className="grid gap-4">
              {profile.codatsCollections.map((collection) => (
                <div key={collection.collectionId}
                     className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">{collection.collectionName}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {collection._count.collectionCodats} codats
                      </p>
                    </div>
                    <Link
                      href={`/collections/${collection.collectionId}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;