"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/loader";
import { motion } from "framer-motion";
import { useModel } from "@/hooks/user-model-store";



const CollectionCodatsPage = () => {
  const {singleCodatCollection,setSingleCodatCollection} = useModel();
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
          setSingleCodatCollection(res.data);
        }
      } catch (error) {
        console.error("Error fetching codats", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCodats()
  }, [collectionId]);

  const collection = singleCodatCollection;

  if (loading || !collection) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-40 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
      />

      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {collection.collectionName}
      </motion.h1>

      <motion.p
        className="text-gray-400 text-lg mb-8 text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {collection.collectionDesc}
      </motion.p>

      <motion.button
        className="px-6 py-3 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-300 transition-transform transform hover:scale-105 mb-6"
        onClick={() => router.push(`/codat/add/${collectionId}`)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Add Codat
      </motion.button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {collection.collectionCodats.map((codat, index) => (
          <motion.div
            key={codat.codatId}
            className="bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:scale-105 border border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-2 text-white">
              {codat.codatName}
            </h2>
            <p className="text-gray-400 mb-4">{codat.codatDescription}</p>
            <p className="text-sm text-gray-300">
              Language: {codat.codatLanguage}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Created: {new Date(codat.createdAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              Updated: {new Date(codat.updatedAt).toLocaleDateString()}
            </p>

            <motion.button
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
              onClick={() => router.push(`/codat/${codat.codatId}`)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              View Codat
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CollectionCodatsPage;
