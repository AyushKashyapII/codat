"use client";

import React, { useState, useEffect } from 'react';
import { Code, Search, Globe, Users, ChevronDown } from 'lucide-react';
import Head from 'next/head';

export default function HomePage() {
  const [typedText, setTypedText] = useState('');
  const welcomeText = "Welcome to Codat";

  useEffect(() => {
    let currentText = '';
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < welcomeText.length) {
        currentText += welcomeText[index];
        setTypedText(currentText);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const features = [
    {
      icon: Code,
      title: 'Code Collection',
      description: 'Save and organize your reusable code snippets',
      hoverClass: 'hover:border-blue-500 hover:text-blue-500',
      bgClass: 'hover:bg-blue-500/10'
    },
    {
      icon: Globe,
      title: 'Cross-Language Conversion',
      description: 'AI-powered code translation between languages',
      hoverClass: 'hover:border-green-500 hover:text-green-500',
      bgClass: 'hover:bg-green-500/10'
    },
    {
      icon: Search,
      title: 'Semantic Search',
      description: 'Intelligent code discovery using AI',
      hoverClass: 'hover:border-red-500 hover:text-red-500',
      bgClass: 'hover:bg-red-500/10'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Follow and explore other developers\' collections',
      hoverClass: 'hover:border-purple-500 hover:text-purple-500',
      bgClass: 'hover:bg-purple-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden relative flex flex-col">
      <Head>
        <title>Codat - Code Collection & Sharing Platform</title>
        <meta name="description" content="Revolutionize the way you manage and share code" />
      </Head>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/5 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-6 flex flex-col justify-center items-center text-center relative z-10">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-6xl font-bold tracking-tight animate-slide-in-top">
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="mt-6 text-2xl text-gray-300 animate-slide-in-bottom max-w-3xl mx-auto">
            Revolutionize the way you manage, share, and discover code across languages and communities
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map(({ icon: Icon, title, description, hoverClass, bgClass }, index) => (
            <div
              key={title}
              className={`group bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg text-center 
              transition transform hover:scale-105 hover:bg-gray-800/70
              animate-fade-in border border-transparent 
              ${hoverClass} ${bgClass}`}
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="flex justify-center mb-4">
                <Icon
                  size={48}
                  className="text-white opacity-80
                  transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 transition">{title}</h3>
              <p className="text-gray-400">{description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center">
          <button className="bg-white text-black px-10 py-4 rounded-full
            font-bold text-lg hover:bg-gray-200
            transition transform hover:scale-105
            animate-bounce-in
            relative overflow-hidden group mb-8">
            Get Started
          </button>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ChevronDown size={32} className="text-white/50" />
          </div>
        </div>
      </div>
    </div>
  );
}


// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
//
// const HomePage = () => {
//   const router = useRouter();
//   const [displayText, setDisplayText] = useState("");
//   const fullText = "Welcome to Codat";
//
//   useEffect(() => {
//     let index = 0;
//     const interval = setInterval(() => {
//       setDisplayText(fullText.slice(0, index + 1));
//       index++;
//       if (index === fullText.length) clearInterval(interval);
//     }, 150);
//
//     return () => clearInterval(interval);
//   }, []);
//
//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-70 pointer-events-none" />
//       <div className="absolute inset-0 bg-fixed bg-center bg-repeat opacity-10 pointer-events-none animate-pulse" />
//
//       <motion.h1
//         className="text-7xl font-extrabold mb-6 text-center tracking-tight text-white border-4 border-white rounded-xl p-4 shadow-glow relative"
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//       >
//         <span>{displayText}</span>
//         <span className="animate-cursor">|</span>
//       </motion.h1>
//
//       <motion.p
//         className="text-white text-xl text-center max-w-3xl mb-10"
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1, delay: 0.3 }}
//       >
//         Create collections, save your codes, and let our AI extract reusable functions.
//         Convert code between languages, search semantically, and connect with other coders.
//       </motion.p>
//
//       <motion.div
//         className="flex space-x-6 mb-16"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1, delay: 0.5 }}
//       >
//         <button
//           className="px-8 py-4 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-300 transition-transform transform hover:scale-105"
//           onClick={() => router.push("/collections")}
//         >
//           Explore Collections
//         </button>
//         <button
//           className="px-8 py-4 bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
//           onClick={() => router.push("/signup")}
//         >
//           Get Started
//         </button>
//       </motion.div>
//
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
//         <FeatureCard
//           title="Reusable Code Extraction"
//           description="AI-powered analysis to extract reusable functions from your code collections."
//         />
//         <FeatureCard
//           title="Code Conversion"
//           description="Convert your code from one language to another effortlessly using AI."
//         />
//         <FeatureCard
//           title="Semantic Search"
//           description="Find the code you need with advanced AI-driven semantic search."
//         />
//       </div>
//     </div>
//   );
// };
//
// const FeatureCard = ({ title, description }: { title: string, description: string }) => (
//   <motion.div
//     className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-sm hover:backdrop-blur-md hover:border-white hover:shadow-glow transition duration-500 ease-in-out transform hover:scale-105"
//     initial={{ opacity: 0, y: 40 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.5 }}
//   >
//     <h2 className="text-3xl font-extrabold mb-3 text-white tracking-wide">
//       {title}
//     </h2>
//     <p className="text-gray-400 text-base leading-relaxed">
//       {description}
//     </p>
//   </motion.div>
// );
//
// export default HomePage;