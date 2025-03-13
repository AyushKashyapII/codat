"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Code,
  Folder,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import SkeletonLoader from "@/components/Skeletonloader";
import axios from "axios";
import { useParams } from "next/navigation";
import ProfileLoaderSkeleton from "@/components/ProfileLoader";
import { profile } from "console";

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

const ProfilePageID = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFollow = async () => {
    if (isDisabled) return;
    setIsDisabled(true);
    try {
      const res = await axios.post(`/api/followings/${id}`);
      console.log("follow sucessful", res);
      setIsFollowing(true);
    } catch (error) {
      console.log("error during following the user", error);
    } finally {
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        if (!id) return;

        const response = await axios.get(`/api/followings`);
        //console.log("response on load..", response);
        const responseData = response.data;
        const followingIds = responseData.map((item: any) => item.following.id);

        if (followingIds.includes(id)) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [id]);

  const handleUnfollow = async () => {
    if (isDisabled) return;
    setIsDisabled(true);

    try {
      const res = await axios.delete(`/api/followings/${id}`);
      console.log("unfollow successful");
      setIsFollowing(false);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/profile/id/${id}`);
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        console.log("Profile data:", data);
        setProfileData(data);

        // Check if the profile contains collections
        if (data.codatsCollections && data.codatsCollections.length > 0) {
          // Extract collection IDs from the profile data
          const userCollections = data.codatsCollections;
          setCollections(userCollections);

          // Fetch codats for each collection
          const codatPromises = userCollections.map((collection: Collection) =>
            axios.get(`/api/collections/${collection.collectionId}`)
          );

          const codatResponses = await Promise.all(codatPromises);
          //console.log("Codat responses for user collections:", codatResponses);

          const codatsMap: Record<string, Codat[]> = {};
          let allUserCodats: Codat[] = [];

          codatResponses.forEach((response, index) => {
            if (response.status === 200) {
              const collectionId = userCollections[index].collectionId;

              if (
                response.data.collectionCodats &&
                Array.isArray(response.data.collectionCodats)
              ) {
                codatsMap[collectionId] = response.data.collectionCodats;
                allUserCodats = [
                  ...allUserCodats,
                  ...response.data.collectionCodats,
                ];
              } else if (Array.isArray(response.data)) {
                codatsMap[collectionId] = response.data;
                allUserCodats = [...allUserCodats, ...response.data];
              }
            }
          });

          console.log("Codats map:", codatsMap);
          setAllCodats(codatsMap);
          setFlattenedCodats(allUserCodats);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const [error, setError] = useState<string | null>(null);
  const [allCodats, setAllCodats] = useState<Record<string, Codat[]>>({});
  const [flattenedCodats, setFlattenedCodats] = useState<Codat[]>([]);
  const sizePattern = ["small", "medium", "large", "medium", "small", "large"];

  const [isFollowing, setIsFollowing] = useState(false);
  //const router = useRouter();
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-2",
    large: "col-span-2 row-span-2",
  };

  const getSizeClass = (index: number): string => {
    const patternIndex = index % sizePattern.length;
    return sizePattern[patternIndex];
  };

  const [collections, setCollections] = useState<Collection[]>([]);
  //const [loading, setLoading] = useState(false);

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

  if (loading)
    return (
      <div className="flex flex-col bg-[#0F1220]">
        <ProfileLoaderSkeleton />
        <SkeletonLoader ownProfile={false} />
      </div>
    );
  if (!profileData) return <div>Profile not found</div>;

  return (
    <div className="min-h-screen bg-[#0F1220] text-white">
      <div className="max-w-8xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-[#1A2035] rounded-lg p-6 shadow-lg mb-6 w-full">
          <div className="flex justify-between items-center">
            {/* Left side - Profile info */}
            <div className="flex items-center gap-6">
              {profileData.image && (
                <img
                  src={profileData?.image}
                  alt={profileData?.name as string}
                  className="w-24 h-24 rounded-full border-2 border-[#3E95FF]"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                <p className="text-[#B8C0D2]">{profileData.email}</p>
              </div>
            </div>

            <div className="bg-[#141B2D] rounded-lg p-4 cursor-pointer">
              <div className=" text-center">
                {isFollowing ? (
                  <div
                    className="border-r border-gray-700 pr-4 flex justify-around  w-[150px]"
                    onClick={() => handleUnfollow()}
                  >
                    <UserCheck size={20} />
                    <h3 className="text-[#3E95FF] font-medium text-center">
                      Following
                    </h3>
                  </div>
                ) : (
                  <div
                    className="border-r border-gray-700 pr-4 flex justify-around w-[150px]"
                    onClick={() => handleFollow()}
                  >
                    <UserPlus size={20} />
                    <h3 className="text-[#3E95FF] font-medium text-center">
                      Follow
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

        {loading ? (
          <SkeletonLoader />
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
                        {collection._count?.collectionCodats}
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
            <div className="lg:w-9/12 h-[90vh] flex flex-col">
              <h2 className="sticky top-0 text-2xl font-bold mb-6 z-10 bg-[#your-background-color]">
                My Codats
              </h2>
              <div className="overflow-y-auto scrollbar-hide flex-1">
                <div
                  className="grid grid-cols-2 md:grid-cols-2 gap-4 auto-rows-auto grid-flow-dense"
                  style={{ minHeight: "120vh" }}
                >
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
                                    ? codat.codatCode.substring(0, 250) + "..."
                                    : codat.codatCode || "No Code Available"}
                                </pre>
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
                                    ? codat?.codatAuthor?.name || "Unknown"
                                    : codat.codatAuthor || "Unknown Author"}
                                </p>
                              </div>
                            </div>

                            {/* Description that appears on hover */}
                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-white/70 mb-3">
                                {codat.codatDescription?.length > 250
                                  ? codat.codatDescription.substring(0, 250) +
                                    "..."
                                  : codat.codatDescription ||
                                    "No Description Available"}
                              </p>
                              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm flex items-center">
                                Explore{" "}
                                <ArrowRight size={16} className="ml-1" />
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
};

export default ProfilePageID;
