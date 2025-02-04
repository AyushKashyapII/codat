"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/loader";
import { motion } from "framer-motion";

interface Codats {
  collectionName: string,
  collectionDesc: string,
  collectionCodats: {
    codatName: string,
    codatDescription: string,
    codatLanguage: string,
    codatId: string,
    createdAt: Date,
    updatedAt: Date
  }[]
}

const CollectionCodatsPage = () => {
  const [codats, setCodats] = useState<Codats|null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const collectionId = params.collectionId;

  useEffect(() => {
    async function fetchCodats() {
      if (!collectionId) {
        router.push("/");
      }

      try {
        const res = await axios.get(`/api/collections/${collectionId}`);
        if (res.status === 200) {
          setCodats(res.data);
        }
      } catch (error) {
        console.error("Error fetching codats", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCodats()
  }, [collectionId]);

  if (loading || !codats) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8 flex flex-col items-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-pattern opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
      />

      <motion.h1
        className="text-5xl font-extrabold mb-4 tracking-wide text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {codats.collectionName}
      </motion.h1>

      <motion.p
        className="text-gray-300 text-xl mb-6 text-center max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {codats.collectionDesc}
      </motion.p>

      <motion.button
        className="px-8 py-4 bg-white text-black font-bold rounded-2xl shadow-2xl hover:bg-gray-300 transition-transform transform hover:scale-110 mb-8"
        onClick={() => router.push(`/codats/add/${collectionId}`)}
        whileTap={{ scale: 0.95 }}
      >
        Add Codat
      </motion.button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {codats.collectionCodats.map((codat, index) => (
          <motion.div
            key={codat.codatId}
            className="bg-gray-800 p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-transform transform hover:scale-105 hover:border-white border border-gray-600 backdrop-blur-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-3xl font-bold mb-3 text-white">
              {codat.codatName}
            </h2>
            <p className="text-gray-400 mb-4 text-sm">
              {codat.codatDescription}
            </p>
            <p className="text-sm text-gray-300 font-mono">
              Language: {codat.codatLanguage}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Created: {new Date(codat.createdAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              Updated: {new Date(codat.updatedAt).toLocaleDateString()}
            </p>

            <div className="flex justify-between mt-4">
              <motion.button
                className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition transform hover:scale-105"
                onClick={() => router.push(`/codats/${codat.codatId}`)}
                whileTap={{ scale: 0.95 }}
              >
                View Codat
              </motion.button>

              <motion.button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition transform hover:scale-105"
                onClick={() => router.push(`/codats/edit/${codat.codatId}`)}
                whileTap={{ scale: 0.95 }}
              >
                Edit
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CollectionCodatsPage;
