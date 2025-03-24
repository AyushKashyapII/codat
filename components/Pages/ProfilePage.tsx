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
interface Collection {
  createdAt: Date;
  updatedAt: Date;
  collectionId: string;
  collectionName: string;
  collectionDesc: string;
  collectionColor?: string; // Add color field
  collectionCodats: Codat[];
  _count: {
    collectionCodats: number;
  };
}
interface Codat {
  codatId: string;
  codatName: string;
  codatDescription: string;
  codatAuthor: { name: string } | string;
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

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useModel } from "@/hooks/user-model-store";
import {
  ArrowRight,
  Code,
  Folder,
  UserPlus,
  Users,
  Pencil,
  X,
  Check,
} from "lucide-react";
import SkeletonLoader from "@/components/Skeletonloader";
import { createHighlighter } from "shiki";
import ProfileLoaderSkeleton from "@/components/ProfileLoader";
import Loader from "../loader";

const useHighlightedCode = (code: string, language: string) => {
  const [highlightedCode, setHighlightedCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlighter = await createHighlighter({
          themes: ["github-dark"],
          langs: [language.toLowerCase()],
        });

        const highlighted = highlighter.codeToHtml(code, {
          lang: language.toLowerCase(),
          theme: "github-dark",
        });

        setHighlightedCode(highlighted);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHighlightedCode(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language]);

  return { highlightedCode, isLoading };
};

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const { highlightedCode, isLoading } = useHighlightedCode(code, language);

  if (isLoading) {
    return <div className="bg-[#0d1117] p-4 rounded-md h-24 animate-pulse" />;
  }

  return (
    <div className="p-4 rounded-md overflow-auto text-sm bg-[#0d1117] max-h-[calc(100vh-12rem)] shadow-lg w-full">
      <div
        className="[&_pre]:!bg-transparent [&_code]:!text-[1.1em] [&_.line]:!leading-6 [&_pre]:!p-0 [&_.shiki]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
};

export default function ProfilePage({
  fullProfile,
  fullcollections,
  fullFollowers,
  fullFollowing,
}: {
  fullProfile: any;
  fullcollections: any;
  fullFollowers: any;
  fullFollowing: any;
}) {
  const [error, setError] = useState<string | null>(null);
  const [allCodats, setAllCodats] = useState<Record<string, Codat[]>>({});
  const [loading, setLoading] = useState(true);
  const sizePattern: Array<"small" | "medium" | "large"> = [
    "small",
    "medium",
    "large",
    "medium",
    "small",
    "large",
  ];
  const router = useRouter();
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-2",
    large: "col-span-2 row-span-2",
  };

  // State for editing collections
  const [editingCollection, setEditingCollection] = useState<string | null>(
    null
  );
  const [editedName, setEditedName] = useState("");
  const [editedColor, setEditedColor] = useState("#3E95FF");
  const [collections, setCollections] = useState<Collection[]>([]);

  // Available color options
  const colorOptions = [
    { name: "Blue", value: "#3E95FF" },
    { name: "Red", value: "#FF5252" },
    { name: "Green", value: "#4CAF50" },
    { name: "Purple", value: "#9C27B0" },
    { name: "Orange", value: "#FF9800" },
    { name: "Teal", value: "#009688" },
    { name: "Pink", value: "#E91E63" },
    { name: "Indigo", value: "#3F51B5" },
  ];

  const getSizeClass = (index: number): keyof typeof sizeClasses => {
    const patternIndex = index % sizePattern.length;
    return sizePattern[patternIndex];
  };

  // Start editing a collection
  const startEditing = (collection: Collection) => {
    setEditingCollection(collection.collectionId);
    setEditedName(collection.collectionName);
    setEditedColor(collection.collectionColor || "#3E95FF");
  };

  // Save collection edit
  const saveCollectionEdit = async (collectionId: string) => {
    try {
      const response = await axios.patch(
        `/api/collections/edit/${collectionId}`,
        {
          collectionName: editedName,
          collectionColor: editedColor,
        }
      );

      if (response.status === 200) {
        setCollections(
          collections.map((collection) =>
            collection.collectionId === collectionId
              ? {
                  ...collection,
                  collectionName: editedName,
                  collectionColor: editedColor,
                }
              : collection
          )
        );

        // Reset editing state
        setEditingCollection(null);
      }
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCollection(null);
  };

  const profile = fullProfile;
  const codatsMap: Record<string, Codat[]> = {};
  const flattenedCodats = useMemo(() => {
    return fullcollections.flatMap((collection) => collection.collectionCodats);
  }, [fullcollections]);
  useEffect(() => {
    setLoading(true);
    setCollections(fullcollections);
    setAllCodats(codatsMap);
    setLoading(false);
  }, [fullcollections]);

  const followers = fullFollowers;
  const following = fullFollowing;

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

  const getCollectionColor = (
    collectionId: string | null
  ): React.CSSProperties => {
    //console.log("seeingi if collection exists");
    if (!collectionId) return { backgroundColor: "rgba(17, 24, 39, 0.3)" };

    // console.log("collection exists", collectionId);

    // console.log("search in collection", collections);

    const collection = collections.find((c) => c.collectionId === collectionId);
    if (!collection) {
      //console.log("no coledetcion match found ");
      return { backgroundColor: "rgb(62, 149, 255)" };
    }

    if (collection.collectionColor) {
      // console.log("foynd..", collection.collectionName);
      // console.log("collection colour ..", collection.collectionColor);
      return { backgroundColor: collection.collectionColor };
    }

    return { backgroundColor: "rgb(62, 149, 255)" };
  };
  if (loading)
    return (
      <div className="flex flex-col bg-[#0F1220]">
        <ProfileLoaderSkeleton />
        <SkeletonLoader ownProfile={true} />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0F1220] text-white">
      <div className="max-w-8xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-[#1A2035] rounded-lg p-6 shadow-lg mb-6 w-full">
          <div className="flex justify-between items-center">
            {/* Left side - Profile info */}
            <div
              className="flex items-center gap-6 relative group cursor-pointer"
              onClick={() => {
                router.push(`/profile/edit`);
              }}
            >
              {profile.image && (
                <img
                  src={profile.image}
                  alt={profile.name as string}
                  className="w-24 h-24 rounded-full border-2 border-[#3E95FF]"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-[#B8C0D2]">{profile.email}</p>
                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded mt-1 whitespace-nowrap">
                  Click to edit profile
                </div>
              </div>
            </div>

            {/* Right side - Followers/Following */}
            <div className="bg-[#141B2D] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border-r border-gray-700 pr-4">
                  <h3 className="text-[#3E95FF] font-medium">Following</h3>
                  <p className="text-xl font-bold">
                    {following ? following.length : 0}
                  </p>
                </div>
                <div>
                  <h3 className="text-[#3E95FF] font-medium">Followers</h3>
                  <p className="text-xl font-bold">
                    {followers ? followers.length : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Following Section */}
          {/* <section className="bg-[#1A2035] rounded-lg p-6 shadow-lg border-t-4 border-[#F97316] md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-6 bg-[#F97316] mr-3 rounded-full"></span>
              Following
            </h2>
            <div className="bg-[#F97316]/10 p-3 rounded-md">
              {profile.usersFollowed?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profile.usersFollowed.map(({ following }) => (
                    <div
                      key={following.id}
                      className="bg-[#1A2035] p-3 rounded-md hover:bg-[#232942] transition"
                    >
                      {following.image && (
                        <img
                          src={following.image}
                          alt={following.name}
                          className="w-10 h-10 rounded-full mb-2"
                        />
                      )}
                      <p className="font-medium">{following.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#B8C0D2]">No users followed.</p>
              )}
            </div>
          </section> */}
        </div>

        {loading ? (
          <SkeletonLoader ownProfile={true} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section (30%) */}
            <div className="lg:w-3/12 space-y-8">
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
                      key={collection.collectionId}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-gray-800/50 transition"
                    >
                      {editingCollection === collection.collectionId ? (
                        // Editing mode
                        <div className="flex flex-col w-full">
                          <div className="flex items-center w-full mb-2">
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="bg-gray-800 text-white px-2 py-1 rounded flex-grow mr-2"
                              autoFocus
                            />
                            <div className="flex">
                              <button
                                onClick={() =>
                                  saveCollectionEdit(collection.collectionId)
                                }
                                className="p-1 bg-green-800/50 hover:bg-green-700 rounded mr-1"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 bg-red-800/50 hover:bg-red-700 rounded"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {colorOptions.map((color) => (
                              <div
                                key={color.value}
                                className={`w-6 h-6 rounded-full cursor-pointer ${
                                  editedColor === color.value
                                    ? "ring-2 ring-white"
                                    : ""
                                }`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => setEditedColor(color.value)}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Normal display mode
                        <>
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/collections/${collection.collectionId}`
                              )
                            }
                          >
                            <div
                              className="w-4 h-4 rounded-full mr-2"
                              style={getCollectionColor(
                                collection.collectionId
                              )}
                            />
                            <span className="font-medium">
                              {collection.collectionName}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-full mr-2">
                              {collection?.collectionCodats?.length}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(collection);
                              }}
                              className="p-1 hover:bg-gray-700 rounded"
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        </>
                      )}
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
            <div className="lg:w-9/12 h-[90vh] flex flex-col">
              <h2 className="sticky top-0 text-2xl font-bold mb-6 z-10 bg-[#your-background-color]">
                My Codats - ({flattenedCodats.length})
              </h2>
              <div className="overflow-y-auto scrollbar-hide flex-1">
                <div
                  className="grid grid-cols-2 md:grid-cols-2 gap-4 auto-rows-auto grid-flow-dense"
                  style={{ minHeight: "120vh" }}
                >
                  {flattenedCodats.length > 0 ? (
                    flattenedCodats.map((codat, index) => {
                      const sizeClass = sizeClasses[getSizeClass(index)];
                      // Find the collection for this codat to get its color
                      const collection = collections.find(
                        (c) => c.collectionId === codat.collectionId
                      );
                      // Use collection color for background if available, otherwise use language color
                      const backgroundColor = collection?.collectionColor
                        ? { backgroundColor: `${collection.collectionColor}30` } // opacity 30%
                        : {};

                      return (
                        <div
                          key={codat.codatId || `index-${index}`}
                          className={`${sizeClass} rounded-lg p-6 relative overflow-hidden group cursor-pointer`}
                          style={backgroundColor}
                          onClick={() => router.push(`/codat/${codat.codatId}`)}
                        >
                          {!collection?.collectionColor && (
                            <div
                              className={`absolute inset-0 ${getLanguageColor(
                                codat.codatLanguage
                              )}`}
                            ></div>
                          )}
                          <div className="relative z-10">
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
                                  <CodeBlock
                                    code={
                                      codat.codatCode?.length > 150
                                        ? codat.codatCode.substring(0, 250) +
                                          "..."
                                        : codat.codatCode || "No Code Available"
                                    }
                                    language={codat.codatLanguage}
                                  />
                                </div>

                                {/* Author info */}
                                <div className="flex items-center mt-2">
                                  <Users
                                    size={16}
                                    className="mr-1 text-gray-400"
                                  />
                                  <p className="text-gray-300 text-sm">
                                    by{" "}
                                    {typeof codat.codatAuthor === "object"
                                      ? codat.codatAuthor.name
                                      : codat.codatAuthor || "Unknown Author"}
                                  </p>
                                </div>
                              </div>

                              {/* Description that appears on hover */}
                              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white/70 mb-3">
                                  {codat.codatAIDesc?.length > 250
                                    ? codat.codatAIDesc.substring(0, 250) +
                                      "..."
                                    : codat.codatAIDesc ||
                                      "No Description Available"}
                                </p>
                                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm flex items-center">
                                  Explore{" "}
                                  <ArrowRight size={16} className="ml-1" />
                                </button>
                              </div>
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
                            : router.push("/codat/add")
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
        )}
      </div>
    </div>
  );
}
