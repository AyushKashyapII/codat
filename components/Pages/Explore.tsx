"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Code, Users, ArrowRight, Folder, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { createHighlighter } from "shiki";

const TAG_STORAGE_KEY = "visitedTags";

interface Codat {
  codatId: string;
  codatName: string;
  codatTags: string[];
  codatDescription?: string;
  codatLikes?: number;
  codatCode?: string;
  codatLanguage?: string;
  codatAuthor?: {
    name: string;
  };
  codatAIDesc?: string;
  authorId?: string;
  createdAt?: string;
}

interface ExplorePageProps {
  savedCodatTags: string[];
  createdCodatTags: string[];
  initialRecommendedCodats: Codat[];
  isGuest: boolean;
  allTags: string[];
}

const getTagsFromLocalStorage = () => {
  if (typeof window === "undefined") return [];
  const storedData = JSON.parse(localStorage.getItem(TAG_STORAGE_KEY) || "{}");
  return storedData.tags || [];
};

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

function ExplorePage({
  savedCodatTags,
  createdCodatTags,
  initialRecommendedCodats,
  isGuest,
  allTags,
}: ExplorePageProps) {
  const [visitedTags, setVisitedTags] = useState<string[]>([]);
  const [recommendedCodats, setRecommendedCodats] = useState(
    initialRecommendedCodats
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const router = useRouter();

  // Pattern for different card sizes
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

  useEffect(() => {
    if (!isGuest) return;

    const tags = getTagsFromLocalStorage();
    setVisitedTags(tags);

    const fetchGuestRecommendations = async () => {
      if (tags.length === 0) return;

      setIsLoading(true);
      try {
        const res = await axios.post("/api/codat/recommend-codats", { tags });
        setRecommendedCodats(res.data);
      } catch (error) {
        console.error("Failed to fetch recommendations for guest user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuestRecommendations();
  }, [isGuest]);

  const handleSearchByTags = async () => {
    if (selectedTags.length === 0) return;

    setIsLoading(true);
    try {
      const res = await axios.post("/api/codat/recommend-codats", {
        tags: selectedTags,
      });
      setRecommendedCodats(res.data);
    } catch (error) {
      console.error("Failed to fetch recommendations for tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
    setRecommendedCodats(initialRecommendedCodats);
  };

  const getLanguageColor = (language: string = "JavaScript"): string => {
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }

    if (isGuest && !visitedTags.includes(tag)) {
      const updatedVisitedTags = [...visitedTags, tag];
      setVisitedTags(updatedVisitedTags);
      localStorage.setItem(
        TAG_STORAGE_KEY,
        JSON.stringify({ tags: updatedVisitedTags })
      );
    }
  };

  const renderTagList = (tags: string[], title: string) => {
    if (!tags || !tags.length) return null;

    return (
      <div className="mb-4  backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-2 flex items-center">
          <Folder className="mr-2" size={18} />
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white border border-blue-400"
                  : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/70"
              } px-3 py-1 rounded-md text-xs transition cursor-pointer`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  //   const handleTagClick = async (tag: string) => {
  //     setIsLoading(true);
  //     try {
  //       const res = await axios.post("/api/codat/recommend-codats", {
  //         tags: [tag],
  //       });
  //       setRecommendedCodats(res.data);

  //       // If guest user, add to visited tags
  //       if (isGuest) {
  //         const updatedVisitedTags = [...new Set([...visitedTags, tag])];
  //         setVisitedTags(updatedVisitedTags);
  //         localStorage.setItem(
  //           TAG_STORAGE_KEY,
  //           JSON.stringify({ tags: updatedVisitedTags })
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch recommendations for tag:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  // Filter out tags that are already in user's tags
  const userTags = [
    ...new Set([
      ...(savedCodatTags || []),
      ...(createdCodatTags || []),
      ...(visitedTags || []),
    ]),
  ];
  const otherTags = allTags
    ? allTags.filter((tag) => !userTags.includes(tag))
    : [];
  const tagsToDisplay = showAllTags ? otherTags : otherTags.slice(0, 8);

  const renderExploreOtherCodats = () => {
    if (!otherTags || !otherTags.length) return null;

    return (
      <div className="mb-4 bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 w-[120%]">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-medium text-white flex items-center mr-8">
            <Hash className="mr-2" size={18} />
            Explore Other Codats
          </h3>
          <div className="flex items-center gap-2">
            {selectedTags.length > 0 && (
              <>
                <button
                  onClick={handleClearAllTags}
                  className="text-sm text-red-400 hover:text-red-300 transition"
                >
                  Clear All
                </button>
                <button
                  onClick={handleSearchByTags}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded"
                >
                  Search
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tagsToDisplay.map((tag) => (
            <span
              key={tag}
              className={`${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white border border-blue-400"
                  : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/70"
              } px-3 py-1 rounded-md text-xs transition cursor-pointer flex items-center`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>

        {otherTags.length > 8 && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            {showAllTags
              ? "Show fewer tags"
              : `Show ${otherTags.length - 8} more tags`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
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

      <div className="container mx-auto px-6 py-16 relative z-10">
        <h2 className="text-4xl font-bold mb-12 text-center">Explore Codats</h2>

        <div className="flex flex-col lg:flex-row gap-8 ">
          <div className="lg:w-3/12 space-y-8">
            {renderTagList(savedCodatTags, "Your Saved Tags")}
            {renderTagList(createdCodatTags, "Your Created Tags")}
            {isGuest && renderTagList(visitedTags, "Recently Explored Tags")}
            {renderExploreOtherCodats()}
          </div>

          {/* Right Section (70%) - Cards */}
          <div className="lg:w-8/12 flex flex-col">
            <h2 className="sticky top-0 text-2xl font-bold mb-6 z-10 bg-transparent backdrop-blur-sm py-2">
              Recommended Codats
            </h2>
            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : recommendedCodats && recommendedCodats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedCodats.map((codat) => (
                    <div
                      key={codat.codatId}
                      className={`${getLanguageColor(codat.codatLanguage)} 
              rounded-lg p-5 relative overflow-hidden group cursor-pointer
              transition transform hover:shadow-lg hover:shadow-blue-500/20
              h-auto`}
                      onClick={() => router.push(`/codat/${codat.codatId}`)}
                    >
                      {/* Language Icon */}
                      <div className="absolute top-0 right-0 p-3">
                        <Code
                          className="text-white/30 group-hover:text-white/50 transition-all"
                          size={24}
                        />
                      </div>

                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-gray-300 text-xs">
                              {codat.codatLanguage || "Unknown"}
                            </h4>
                          </div>
                          <h3 className="text-lg font-bold mb-2">
                            {codat.codatName}
                          </h3>

                          {/* Code snippet preview */}
                          {codat.codatCode && (
                            <div className="bg-black/30 rounded p-2 my-2 overflow-hidden max-h-24 font-mono text-xs text-gray-200">
                              <pre className="line-clamp-3">
                                {codat.codatCode?.length > 100
                                  ? codat.codatCode.substring(0, 100) + "..."
                                  : codat.codatCode}
                              </pre>
                            </div>
                          )}

                          {/* Author info */}
                          <div className="flex items-center mt-2">
                            <Users size={14} className="mr-1 text-gray-400" />
                            <p className="text-gray-300 text-xs">
                              by {codat.codatAuthor?.name || "Unknown Author"}
                            </p>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {codat.codatTags &&
                              codat.codatTags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-black/30 text-gray-300 px-2 py-0.5 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            {codat.codatTags && codat.codatTags.length > 3 && (
                              <span className="bg-black/30 text-gray-300 px-2 py-0.5 rounded text-xs">
                                +{codat.codatTags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-span-2 p-12 text-center bg-gray-900/30 rounded-lg">
                  <Code size={48} className="mx-auto mb-4 text-gray-500" />
                  <h4 className="text-xl font-semibold mb-2">
                    No Recommendations Found
                  </h4>
                  <p className="text-gray-400 mb-4">
                    We couldn't find any codats matching your interests.
                  </p>
                  <button
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-md inline-flex items-center"
                    onClick={() => router.push("/explore")}
                  >
                    Explore More <ArrowRight size={16} className="ml-2" />
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

export default ExplorePage;
