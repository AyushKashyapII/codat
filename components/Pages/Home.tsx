"use client";
interface CodeSnippet {
  title: string;
  code: string;
  author: string;
  language: string;
  description: string;
  stars: number;
  difficulty: string;
}
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Code,
  Search,
  Globe,
  Users,
  ChevronDown,
  Star,
  Clock,
  UserPlus,
  ArrowRight,
  Folder,
} from "lucide-react";
import Head from "next/head";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useModel } from "@/hooks/user-model-store";
import SkeletonLoader from "../Skeletonloader";
import ExplorePage from "./Explore";

interface Collection {
  createdAt: Date;
  updatedAt: Date;
  collectionId: string;
  collectionName: string;
  collectionDesc: string;
  _count: {
    collectionCodats: number;
  };
}

interface Codat {
  codatId: string;
  codatName: string;
  codatDescription: string;
  codatAuthor: string;
  authorId: string;
  codatCode: string;
  codatLanguage: string;
  codatIsPublic: boolean;
  codatAIDesc: string;
  codatAIFunc: string;
  collectionId: string | null;
  createdAt: string;
  updatedAt: string;
}

const TAG_STORAGE_KEY = "visitedTags";
const cleanUpExpiredTags = () => {
  const storedData = JSON.parse(localStorage.getItem(TAG_STORAGE_KEY) || "{}");
  const now = Date.now();

  if (!storedData.tags || storedData.expiresAt < now) {
    localStorage.removeItem(TAG_STORAGE_KEY);
  }
};
export default function HomePage() {
  const [typedText, setTypedText] = useState("");

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const welcomeText = "Welcome to Codat";
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [createdCodatTags, setCreatedCodatTags] = useState([]);
  const [savedCodatTags, setSavedCodatTags] = useState([]);
  const [recommendedCodats, setRecommendedCodats] = useState([]);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      setLoading((value) => !value);
      try {
        const res = await axios.get(`/api/explore`);

        if (res.status == 200) {
          if (res.data.isGuest) {
            setIsGuest(res.data.isGuest);
          }
          if (res.data.createdCodatTags) {
            setCreatedCodatTags(res.data.createdCodatTags);
          }
          if (res.data.savedCodatTags) {
            setSavedCodatTags(res.data.savedCodatTags);
          }
          if (res.data.recommendedCodats) {
            setRecommendedCodats(res.data.recommendedCodats);
          }
          if (res.data.allTags) {
            setAllTags(res.data.allTags);
          }
        }
      } catch (error) {
        console.error("Error fetching collections", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    cleanUpExpiredTags();
  }, []);

  useEffect(() => {
    let currentText = "";
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

  const teams = [
    { name: "Algorithm Enthusiasts", members: 8 },
    { name: "CP Warriors", members: 6 },
    { name: "Data Structure Wizards", members: 7 },
    { name: "Interview Prep Group", members: 12 },
    { name: "LeetCode Daily", members: 15 },
    { name: "System Design Team", members: 5 },
    { name: "Hackathon Squad", members: 8 },
    { name: "DSA Mentors", members: 4 },
  ];

  const features = [
    {
      icon: Code,
      title: "Code Collection",
      description: "Save and organize your reusable code snippets",
      hoverClass: "hover:border-blue-500 hover:text-blue-500",
      bgClass: "hover:bg-blue-500/10",
    },
    {
      icon: Globe,
      title: "Cross-Language Conversion",
      description: "AI-powered code translation between languages",
      hoverClass: "hover:border-green-500 hover:text-green-500",
      bgClass: "hover:bg-green-500/10",
    },
    {
      icon: Search,
      title: "Semantic Search",
      description: "Intelligent code discovery using AI",
      hoverClass: "hover:border-red-500 hover:text-red-500",
      bgClass: "hover:bg-red-500/10",
    },
    {
      icon: Users,
      title: "Community",
      description: "Follow and explore other developers' collections",
      hoverClass: "hover:border-purple-500 hover:text-purple-500",
      bgClass: "hover:bg-purple-500/10",
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden relative flex flex-col">
      <div className="">
        <Head>
          <title>Codat - Code Collection & Sharing Platform</title>
          <meta
            name="description"
            content="Revolutionize the way you manage and share code"
          />
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
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-grow container mx-auto px-6 flex flex-col justify-center items-center text-center relative z-10">
          {/* Header */}
          <header className="mb-16 mt-10">
            <h1 className="text-6xl font-bold tracking-tight animate-slide-in-top">
              {typedText}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="mt-6 text-2xl text-gray-300 animate-slide-in-bottom max-w-3xl mx-auto">
              Revolutionize the way you manage, share, and discover code across
              languages and communities
            </p>
          </header>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map(
              (
                { icon: Icon, title, description, hoverClass, bgClass },
                index
              ) => (
                <div
                  key={title}
                  className={`group bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg text-center 
              transition transform hover:scale-105 hover:bg-gray-800/70
              animate-fade-in border border-transparent 
              ${hoverClass} ${bgClass}`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <Icon
                      size={48}
                      className="text-white opacity-80
                  transition-transform group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 transition">
                    {title}
                  </h3>
                  <p className="text-gray-400">{description}</p>
                </div>
              )
            )}
          </div>

          {/* Call to Action */}
          <div className="flex flex-col items-center">
            <button
              className="bg-white text-black px-10 py-4 rounded-full
            font-bold text-lg hover:bg-gray-200
            transition transform hover:scale-105
            animate-bounce-in
            relative overflow-hidden group mb-8"
            // onClick={()=>{
            //   router.push(`signup`)
            // }}
            >
              Get Started
            </button>

            {/* Scroll Indicator */}
            <div className="animate-bounce">
              <ChevronDown size={32} className="text-white/50" />
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-2  py-16 relative z-10 ">
        <h2 className="text-4xl font-bold mb-12 text-center"></h2>

        {loading ? (
          <SkeletonLoader ownProfile={true} />
        ) : (
          <ExplorePage
            createdCodatTags={createdCodatTags}
            savedCodatTags={savedCodatTags}
            initialRecommendedCodats={recommendedCodats}
            isGuest={isGuest}
            allTags={allTags}
          />
        )}
      </div>
    </div>
  );
}
