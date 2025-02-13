"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Loader from "@/components/loader";

interface Follower {
  follower: {
    name: string | null;
    id: string;
    email: string;
    image: string | null;
  };
}

const FollowersPage = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFollowers() {
      try {
        const res = await axios.get(`/api/followers`);
        if (res.status === 200) {
          setFollowers(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching followers", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    fetchFollowers();
  }, [router]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <motion.h1
        className="text-4xl font-extrabold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Followers
      </motion.h1>

      {followers.length === 0 ? (
        <p className="text-gray-400">No followers yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {followers.map(({ follower }, index) => (
            <motion.div
              key={follower.id}
              className="bg-gray-900 p-6 rounded-xl flex items-center gap-4 shadow-lg border border-gray-700 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={follower.image || "/default-avatar.png"}
                alt={follower.name || "User"}
                className="w-14 h-14 rounded-full border border-gray-600"
              />
              <div>
                <p className="text-lg font-bold">{follower.name || "Anonymous"}</p>
                <p className="text-gray-400 text-sm">{follower.email}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowersPage;
