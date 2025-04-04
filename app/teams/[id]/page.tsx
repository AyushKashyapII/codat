"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createHighlighter } from "shiki";

interface TeamMember {
  name: string | null;
  id: string;
  image: string | null;
}

interface TeamCollection {
  collectionId: string;
  collectionName: string;
}

interface CodatBasic {
  id: string;
  // Other basic fields from collection endpoint
}

interface Codat {
  id: string;
  title: string;
  language: string;
  content: string;
  authorId: string;
  authorName: string;
}

interface Team {
  createdAt: Date;
  updatedAt: Date;
  teamId: string;
  teamName: string;
  teamOwner: TeamMember;
  teamMembers: TeamMember[];
  teamModerators: TeamMember[];
  teamCollections: TeamCollection[];
}

interface CodatsData {
  byCollection: Record<string, Codat[]>;
  byMember: Record<string, Codat[]>;
  allCodats: Codat[];
}

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

  if (!isLoading) {
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

export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [codatsData, setCodatsData] = useState<CodatsData>({
    byCollection: {},
    byMember: {},
    allCodats: [],
  });
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const handleFilterByCollection = (
    collectionId: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveCollection(
      activeCollection === collectionId ? null : collectionId
    );
  };

  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true);
        const response = await axios.get(`/api/teams/${id}`);
        if (response.status === 200) {
          setTeam(response.data);

          const allCollections = response.data.teamCollections.map(
            (collection: TeamCollection) => collection.collectionId
          );
          console.log("collections ", allCollections);

          if (allCollections.length > 0) {
            await fetchMembersCodats(allCollections);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        setError("Error fetching team data.");
        setLoading(false);
      }
    }
    fetchTeam();
  }, [id]);

  const fetchMembersCodats = async (collectionIds: string[]) => {
    try {
      const allCodats: Codat[] = [];
      const byCollection: Record<string, Codat[]> = {};

      for (const collectionId of collectionIds) {
        try {
          const collectionResponse = await axios.get(
            `/api/collections/${collectionId}`
          );

          if (
            collectionResponse.status === 200 &&
            collectionResponse.data.collectionCodats?.length > 0
          ) {
            //console.log("collection codats", collectionResponse.data.collectionCodats);
            const collectionName = collectionResponse.data.collectionName;
            const codatsFromCollection =
              collectionResponse.data.collectionCodats.map((codat: any) => {
                let authorId = "";
                let authorName = "Unknown";

                if (
                  typeof codat.codatAuthor === "object" &&
                  codat.codatAuthor !== null
                ) {
                  authorId = codat.codatAuthor.id || "";
                  authorName = codat.codatAuthor.name || "Unknown";
                } else if (typeof codat.codatAuthor === "string") {
                  authorId = codat.codatAuthor;
                }

                return {
                  id: codat.codatId,
                  title: codat.codatName,
                  language: codat.codatLanguage,
                  content: codat.codatCode,
                  authorId: authorId,
                  authorName: authorName,
                  collectionId,
                };
              });

            allCodats.push(...codatsFromCollection);

            byCollection[collectionId] = codatsFromCollection;
          }
        } catch (err) {
          console.log(`Error fetching collection ${collectionId}:`, err);
        }
      }

      const byMember: Record<string, Codat[]> = {};

      for (const codat of allCodats) {
        if (codat.authorId) {
          if (!byMember[codat.authorId]) {
            byMember[codat.authorId] = [];
          }
          byMember[codat.authorId].push(codat);
        }
      }

      setCodatsData({
        byCollection,
        byMember,
        allCodats,
      });
    } catch (error) {
      console.error("Error in fetchMembersCodats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollection = async () => {
    if (!collectionName.trim()) return alert("Collection Name is required.");

    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/teams/collections/${id}`, {
        collectionName,
        collectionDesc,
      });

      if (response.status === 200) {
        setTeam((prev) =>
          prev
            ? {
                ...prev,
                teamCollections: [
                  ...prev.teamCollections,
                  { collectionId: response.data.collectionId, collectionName },
                ],
              }
            : prev
        );
        setIsAddingCollection(false);
        setCollectionName("");
        setCollectionDesc("");
      }
    } catch (err) {
      alert("Error adding collection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewMemberCodats = (memberId: string) => {
    setActiveMember(memberId === activeMember ? null : memberId);
  };

  const navigateToMemberProfile = (memberId: string) => {
    router.push(`/users/${memberId}`);
  };
  const [isCopied, setIsCopied] = useState(false);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#121628]">
        <p className="text-blue-400">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#121628]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  if (!team)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#121628]">
        <p className="text-blue-400">No team data available.</p>
      </div>
    );

  // Get all members
  const allMembers = [
    team.teamOwner,
    ...team.teamModerators,
    ...team.teamMembers,
  ];

  // Get total codats count
  const totalCodats = codatsData.allCodats.length;

  return (
    <div className="min-h-screen bg-[#121628] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Team Header */}
        <div className="flex justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">{team.teamName}</h1>
            <div className="flex items-center mt-2">
              <span className="text-gray-400">
                Team Owner: {team.teamOwner.name || "Unknown"}
              </span>
              <span className="mx-4 text-gray-600">|</span>
              <span className="text-gray-400">
                Members: {allMembers.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <button
              onClick={() => {
                const inviteLink = `${team.teamId}`;
                navigator.clipboard
                  .writeText(inviteLink)
                  .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 3000);
                  })
                  .catch((err) => {
                    console.error("Failed to copy: ", err);
                  });
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 18v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="12" height="12" rx="2" ry="2"></rect>
              </svg>
              {isCopied ? "Copied!" : "Generate Invite Link"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-[#1a1f36] rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Team Members</h2>
                <span className="text-sm text-gray-400">
                  {allMembers.length} members
                </span>
              </div>

              <div className="space-y-3">
                <div
                  className="flex justify-between items-center p-3 bg-[#232842] rounded-lg cursor-pointer hover:bg-[#2a305a]"
                  onClick={() => navigateToMemberProfile(team.teamOwner.id)}
                >
                  <div>
                    <p className="font-medium">
                      {team.teamOwner.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">Owner</p>
                  </div>
                  <div>
                    <button
                      className="bg-[#3a4173] p-2 rounded-md hover:bg-[#454f8a] transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewMemberCodats(team.teamOwner.id);
                      }}
                    >
                      <span className="text-xs">
                        Codats{" "}
                        {codatsData.byMember[team.teamOwner.id]?.length || 0}
                      </span>
                    </button>
                  </div>
                </div>

                {team.teamModerators.map((moderator) => (
                  <div
                    key={moderator.id}
                    className="flex justify-between items-center p-3 bg-[#232842] rounded-lg cursor-pointer hover:bg-[#2a305a]"
                    onClick={() => navigateToMemberProfile(moderator.id)}
                  >
                    <div>
                      <p className="font-medium">
                        {moderator.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400">Moderator</p>
                    </div>
                    <div>
                      <button
                        className="bg-[#3a4173] p-2 rounded-md hover:bg-[#454f8a] transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMemberCodats(moderator.id);
                        }}
                      >
                        <span className="text-xs">
                          Codats{" "}
                          {codatsData.byMember[moderator.id]?.length || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}

                {team.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center p-3 bg-[#232842] rounded-lg cursor-pointer hover:bg-[#2a305a]"
                    onClick={() => navigateToMemberProfile(member.id)}
                  >
                    <div>
                      <p className="font-medium">{member.name || "Unknown"}</p>
                      <p className="text-xs text-gray-400">Member</p>
                    </div>
                    <div>
                      <button
                        className="bg-[#3a4173] p-2 rounded-md hover:bg-[#454f8a] transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMemberCodats(member.id);
                        }}
                      >
                        <span className="text-xs">
                          Codats {codatsData.byMember[member.id]?.length || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1f36] rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Collections</h2>
                <button
                  className="bg-[#3a4173] px-3 py-1 rounded-lg hover:bg-[#454f8a] transition text-sm"
                  onClick={() => setIsAddingCollection(true)}
                >
                  + Add Collection
                </button>
              </div>

              {team.teamCollections.length > 0 ? (
                <div className="space-y-2">
                  {team.teamCollections.map((collection) => (
                    <div className="" key={collection.collectionId}>
                      <Link
                        href={`/teams/collections/${collection.collectionId}`}
                        key={collection.collectionId}
                        className="block p-3 bg-[#232842] rounded-lg hover:bg-[#2a305a] transition flex justify-between items-center"
                      >
                        <span>{collection.collectionName}</span>
                        <div className="flex items-center space-x-2">
                          <span>
                            {codatsData.byCollection[collection.collectionId]
                              ?.length || 0}
                          </span>
                          <button
                            onClick={(e) =>
                              handleFilterByCollection(
                                collection.collectionId,
                                e
                              )
                            }
                            className={`ml-2 p-1 rounded-full ${
                              activeCollection === collection.collectionId
                                ? "bg-blue-500"
                                : "bg-gray-600 hover:bg-gray-500"
                            }`}
                            title="Filter by collection"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                              />
                            </svg>
                          </button>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No collections yet.</p>
              )}
            </div>
          </div>

          {/* Right Column - Codats */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1f36] rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {activeMember
                    ? `${
                        allMembers.find((m) => m.id === activeMember)?.name ||
                        "Member"
                      }'s Codats`
                    : activeCollection
                    ? `${
                        team.teamCollections.find(
                          (c) => c.collectionId === activeCollection
                        )?.collectionName || "Collection"
                      } Codats`
                    : `Team Codats (${totalCodats})`}
                </h2>
                {(activeMember || activeCollection) && (
                  <button
                    className="text-sm text-blue-400 hover:text-blue-300"
                    onClick={() => {
                      setActiveMember(null);
                      setActiveCollection(null);
                    }}
                  >
                    View all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeMember ? (
                  codatsData.byMember[activeMember]?.length > 0 ? (
                    codatsData.byMember[activeMember].map((codat) => (
                      <div
                        key={codat.id}
                        className="bg-[#232842] p-5 rounded-lg hover:bg-[#2a305a] transition cursor-pointer shadow-md flex flex-col h-48 border border-[#2d335f]"
                        onClick={() => router.push(`/codat/${codat.id}`)}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-lg text-white truncate pr-2">
                            {codat.title}
                          </h3>
                          <span className="text-xs bg-[#3a4173] px-3 py-1 rounded-full text-blue-100 font-medium">
                            {codat.language}
                          </span>
                        </div>
                        <div className="text-sm text-gray-300 mb-2 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span>{codat.authorName || "Unknown"}</span>
                        </div>
                        <div className="mt-auto">
                          <div className="overflow-hidden text-sm text-gray-400 line-clamp-3 bg-[#1e2138] p-3 rounded border-l-4 border-blue-500 font-mono">
                            <CodeBlock
                              code={
                                codat.content?.length > 150
                                  ? codat.content.substring(0, 250) + "..."
                                  : codat.content || "No Code Available"
                              }
                              language={codat.language}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-2 text-center py-10">
                      No codats available for this member.
                    </p>
                  )
                ) : activeCollection ? (
                  codatsData.byCollection[activeCollection]?.length > 0 ? (
                    codatsData.byCollection[activeCollection].map((codat) => (
                      <div
                        key={codat.id}
                        className="bg-[#232842] p-5 rounded-lg hover:bg-[#2a305a] transition cursor-pointer shadow-md flex flex-col h-48 border border-[#2d335f]"
                        onClick={() => router.push(`/codat/${codat.id}`)}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-lg text-white truncate pr-2">
                            {codat.title}
                          </h3>
                          <span className="text-xs bg-[#3a4173] px-3 py-1 rounded-full text-blue-100 font-medium">
                            {codat.language}
                          </span>
                        </div>
                        <div className="text-sm text-gray-300 mb-2 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span>{codat.authorName || "Unknown"}</span>
                        </div>
                        <div className="mt-auto">
                          <div className="overflow-hidden text-sm text-gray-400 line-clamp-3 bg-[#1e2138] p-3 rounded border-l-4 border-blue-500 font-mono">
                            {codat.content?.substring(0, 150)}...
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-2 text-center py-10">
                      No codats available for this collection.
                    </p>
                  )
                ) : codatsData.allCodats.length > 0 ? (
                  codatsData.allCodats.map((codat) => (
                    <div
                      key={codat.id}
                      className="bg-[#232842] p-5 rounded-lg hover:bg-[#2a305a] transition cursor-pointer shadow-md flex flex-col h-48 border border-[#2d335f]"
                      onClick={() => router.push(`/codat/${codat.id}`)}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg text-white truncate pr-2">
                          {codat.title}
                        </h3>
                        <span className="text-xs bg-[#3a4173] px-3 py-1 rounded-full text-blue-100 font-medium">
                          {codat.language}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 mb-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span>{codat.authorName || "Unknown"}</span>
                      </div>
                      <div className="mt-auto">
                        <div className="overflow-hidden text-sm text-gray-400 line-clamp-3 bg-[#1e2138] p-3 rounded border-l-4 border-blue-500 font-mono">
                          {codat.content?.substring(0, 150)}...
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 col-span-2 text-center py-10">
                    No codats available for this team.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Collection Modal */}
      {isAddingCollection && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1a1f36] p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Collection</h2>
            <input
              type="text"
              placeholder="Collection Name"
              className="w-full p-2 border rounded-md mb-3 bg-[#232842] border-[#3a4173] text-white"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Collection Description"
              className="w-full p-2 border rounded-md mb-3 bg-[#232842] border-[#3a4173] text-white"
              value={collectionDesc}
              onChange={(e) => setCollectionDesc(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-[#232842] text-white px-4 py-2 rounded-lg hover:bg-[#2a305a]"
                onClick={() => setIsAddingCollection(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#3a4173] text-white px-4 py-2 rounded-lg hover:bg-[#454f8a] transition disabled:opacity-50"
                disabled={isSubmitting}
                onClick={handleAddCollection}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
