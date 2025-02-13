"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

interface User {
  name: string | null;
  id: string;
  image: string | null;
}

const SearchUsersPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/search/${query}`);
      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Error searching users", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <motion.h1
        className="text-4xl font-extrabold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Search Users
      </motion.h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <motion.button
          className="px-6 py-2 bg-white text-black font-bold rounded-lg shadow-md hover:bg-gray-300 transition"
          onClick={handleSearch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              className="bg-gray-900 p-6 rounded-xl flex items-center gap-4 shadow-lg border border-gray-700 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0, delay: index * 0.1 }}
            >
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name || "User"}
                className="w-14 h-14 rounded-full border border-gray-600"
              />
              <div>
                <p className="text-lg font-bold">{user.name || "Anonymous"}</p>
                <Link
                  href={`/user/${user.id}`}
                  className="text-blue-400 hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No users found.</p>
      )}
    </div>
  );
};

export default SearchUsersPage;
