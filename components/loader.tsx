"use client";

import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex items-center space-x-4">
        {/* Animated Text */}
        <motion.div
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, 0, 20],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          Loading
        </motion.div>

        {/* Animated Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-5 h-5 bg-white rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: dot * 0.2,
                  ease: "easeInOut"
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Subtle Background Animation */}
      <motion.div
        className="absolute inset-0 z-[-1] bg-black opacity-50"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
    </div>
  );
};

export default Loader;