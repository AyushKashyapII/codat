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
import { useRouter } from "next/navigation";
import { useModel } from "@/hooks/user-model-store";

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

export default function HomePage() {
  const [typedText, setTypedText] = useState("");
  const [allCodats, setAllCodats] = useState<Record<string, Codat[]>>({});
  const [flattenedCodats, setFlattenedCodats] = useState<Codat[]>([]);
  const sizePattern = ["small", "medium", "large", "medium", "small", "large"];

  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-2",
    large: "col-span-2 row-span-2",
  };

  const getSizeClass = (index: number): string => {
    const patternIndex = index % sizePattern.length;
    return sizePattern[patternIndex];
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const welcomeText = "Welcome to Codat";
  const router = useRouter();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await axios.get<Collection[]>(`/api/collections/user`);

        if (res.status === 200) {
          setCollections(res.data);

          // codats from each individual collection
          const codatPromises = res.data.map((collectionItem) =>
            axios.get(`/api/collections/${collectionItem.collectionId}`)
          );

          const codatResponses = await Promise.all(codatPromises);
          console.log("all codat responses", codatResponses);

          // Create an object with collection IDs as keys and their codats as values
          const codatsMap: Record<string, Codat[]> = {};
          let allUserCodats: Codat[] = [];

          codatResponses.forEach((response, index) => {
            if (response.status === 200) {
              // Check if the response has collectionCodats property
              if (
                response.data.collectionCodats &&
                Array.isArray(response.data.collectionCodats)
              ) {
                // Store the codats array in the map
                codatsMap[res.data[index].collectionId] =
                  response.data.collectionCodats;
                // Add all codats to the flattened array
                allUserCodats = [
                  ...allUserCodats,
                  ...response.data.collectionCodats,
                ];
              } else if (Array.isArray(response.data)) {
                // Handle case where response.data is already an array of codats
                codatsMap[res.data[index].collectionId] = response.data;
                allUserCodats = [...allUserCodats, ...response.data];
              }
            }
          });

          console.log("codats map", codatsMap);
          setAllCodats(codatsMap);
          setFlattenedCodats(allUserCodats);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching collections", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
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

  const snippets: CodeSnippet[] = [
    {
      title: "React Hooks",
      code: `function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return { count, increment, decrement };
}`,
      author: "Ayush",
      language: "JavaScript",
      description:
        "A custom React hook for managing counter state with increment and decrement functions",
      stars: 1000,
      difficulty: "Intermediate",
    },
    {
      title: "CSS Grid Layout",
      code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 1rem;
}`,
      author: "Lamine Yamal",
      language: "CSS",
      description:
        "A responsive grid layout that automatically adjusts columns based on available space",
      stars: 28,
      difficulty: "Beginner",
    },
    {
      title: "Python List Comprehension",
      code: `# Create a list of squares
squares = [x**2 for x in range(10)]

# Filter even numbers and square them
even_squares = [x**2 for x in range(10) if x % 2 == 0]`,
      author: "Vinicius",
      language: "Python",
      description:
        "Efficient way to create and transform lists in Python using list comprehension syntax",
      stars: 35,
      difficulty: "Beginner",
    },
  ];

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

  const getCardSize = (codat: Codat | undefined) => {
    const codeDescriptionLength = codat?.codatDescription?.length || 0;
    const codeLength = codat?.codatCode?.length || 0;

    if (codeLength > 800) {
      return "col-span-2 row-span-1";
    } else if (codeDescriptionLength > 200) {
      return "col-span-1 row-span-2";
    } else if (codeLength > 400 && codeDescriptionLength > 100) {
      return "col-span-2 row-span-2";
    } else {
      return "col-span-1 row-span-1";
    }
  };

  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-900/30",
      Python: "bg-blue-900/30",
      Rust: "bg-purple-900/30",
      Go: "bg-orange-900/30",
      TypeScript: "bg-blue-800/30",
      Java: "bg-red-900/30",
    };

    return colors[language] || "bg-gray-900/30";
  };

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

      <div className="container mx-auto px-6 py-16 relative z-10 ">
        <h2 className="text-4xl font-bold mb-12 text-center">Explore Codat</h2>

        {/* Flex Container */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section (30%) */}
          <div className="lg:w-5/10 space-y-8">
            {/* Collections Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 flex flex-col h-[50vh]">
              <div className="sticky top-0 z-10 pb-4 bg-gray-900/50 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold flex items-center">
                    <Folder className="mr-2" size={24} />
                    Collections
                  </h3>
                  <button
                    className="text-sm text-gray-400 hover:text-white flex items-center"
                    onClick={() => router.push("/collections/user")}
                  >
                    View All <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto scrollbar-hide flex-grow mt-2">
                {collections.map((collection) => (
                  <div
                    key={collection.collectionName}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-gray-800/50 transition cursor-pointer"
                    onClick={() => {
                      router.push(`/collections/${collection.collectionId}`);
                    }}
                  >
                    <span className="font-medium">
                      {collection.collectionName}
                    </span>
                    <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                      {collection._count.collectionCodats}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teams Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 flex flex-col h-[50vh]">
              <div className="sticky top-0 z-10 pb-4 bg-gray-900/50 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold flex items-center">
                    <UserPlus className="mr-2" size={24} />
                    Teams
                  </h3>
                  <button
                    className="text-sm text-gray-400 hover:text-white flex items-center"
                    onClick={() => router.push("/teams")}
                  >
                    View All <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto scrollbar-hide flex-grow mt-2">
                {teams.map((team) => (
                  <div
                    key={team.name}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-gray-800/50 transition cursor-pointer"
                  >
                    <span className="font-medium">{team.name}</span>
                    <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                      {team.members} members
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section (70%) - Cards */}
          <div className="lg:w-7/10 ">
            <h2 className="text-2xl font-bold mb-6">My Codats</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-10 auto-rows-auto grid-flow-dense">
              {flattenedCodats.length > 0 ? (
                flattenedCodats.map((codat, index) => {
                  const sizeClass = sizeClasses[getSizeClass(index)];
                  return (
                    <div
                      key={codat.codatId || "index-${codat.codatId}"}
                      className={`${sizeClass} ${getLanguageColor(
                        codat.codatLanguage
                      )} rounded-lg p-6 relative overflow-hidden group cursor-pointer`}
                      onClick={() => router.push(`/codat/${codat.codatId}`)}
                    >
                      {/* Language Icon */}
                      <div className="absolute top-0 right-0 p-4">
                        <Code
                          className="text-white/30 group-hover:text-white/50 transition-all"
                          size={32}
                        />
                      </div>

                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-gray-300 text-sm">
                              {codat.codatLanguage}
                            </h4>
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {codat.codatName}
                          </h3>

                          {/* Code snippet preview */}
                          <div className="bg-black/30 rounded p-3 my-3 overflow-hidden max-h-32 font-mono text-sm text-gray-200">
                            <pre className="line-clamp-5">
                              {codat.codatCode?.length > 150
                                ? codat.codatCode.substring(0, 150) + "..."
                                : codat.codatCode || "No Code Available"}
                            </pre>
                          </div>

                          {/* Author info */}
                          <div className="flex items-center mt-2">
                            <Users size={16} className="mr-1 text-gray-400" />
                            <p className="text-gray-300 text-sm">
                              by{" "}
                              {typeof codat.codatAuthor === "object"
                                ? codat?.codatAuthor?.name || "Unknown"
                                : codat.codatAuthor || "Unknown Author"}
                            </p>
                          </div>
                        </div>

                        {/* Description that appears on hover */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white/70 mb-3">
                            {codat.codatDescription?.length > 250
                              ? codat.codatDescription.substring(0, 250) + "..."
                              : codat.codatDescription ||
                                "No Description Available"}
                          </p>
                          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm flex items-center">
                            Explore <ArrowRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 p-12 text-center bg-gray-900/30 rounded-lg">
                  <Code size={48} className="mx-auto mb-4 text-gray-500" />
                  <h4 className="text-xl font-semibold mb-2">
                    No Codats Found
                  </h4>
                  <p className="text-gray-400 mb-4">
                    You don't have any codats in your collections yet.
                  </p>
                  <button
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-md inline-flex items-center"
                    onClick={() =>
                      collections.length > 0
                        ? router.push(
                            `/collections/${collections[0].collectionId}/new`
                          )
                        : router.push("/collections/new")
                    }
                  >
                    Add Codat <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
