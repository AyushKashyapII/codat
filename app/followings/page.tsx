"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User } from 'lucide-react';
import Loader from "@/components/loader";
import Link from "next/link";

interface Following {
  following: {
    name: string | null;
    id: string;
    email: string;
    image: string | null;
  };
}

const FollowingPage = () => {
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const res = await axios.get(`/api/followings`);
        if (res.status === 200) {
          setFollowing(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching following", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFollowing();
  }, [router]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-3">
            <User className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Following</h1>
            <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              {following.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {following.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">You are not following anyone yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {following.map((item) => (
              <Link
                href={`/profile/${item.following.id}`}
                key={item.following.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors duration-200 border border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    {item.following.image ? (
                      <img
                        src={item.following.image}
                        alt={item.following.name || 'User'}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium">
                        {item.following.name}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.following.name || 'Anonymous User'}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {item.following.email}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
