import { Folder, UserPlus } from "lucide-react";
import React from "react";

const SkeletonLoader = ({ ownProfile }) => {
  return (
    <div className="flex w-full min-h-screen bg-gray-900 text-white">
      {/* Left Sidebar (25% width on desktop) */}
      <div className="w-1/4 min-w-64 border-r border-gray-800 p-6">
        {/* Collections Section */}
        <div className="mb-10">
          <div className="flex items-center mb-6">
            <div className="h-6 w-6 bg-gray-800 rounded animate-pulse mr-2">
              <Folder className="mr-2" size={24} />
            </div>
            <div className="h-6 w-32 bg-gray-800 rounded animate-pulse text-white font-bold">
              Collections
            </div>
          </div>

          {/* Collection items */}
          <div className="space-y-4 ml-2">
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="mt-10">
          <div className="flex items-center mb-6">
            <div className="h-6 w-6 bg-gray-800 rounded animate-pulse mr-2">
              <UserPlus className="mr-2" size={24} />
            </div>
            <div className="h-6 w-24 bg-gray-800 rounded animate-pulse text-white font-bold">
              Teams
            </div>
          </div>

          {/* Team items */}
          <div className="space-y-4 ml-2">
            <div className="flex justify-between items-center">
              <div className="h-5 w-36 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-5 w-12 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-5 w-28 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-5 w-12 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-5 w-12 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-3/4 p-6">
        {/* Header - My Codats */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-800 rounded-md animate-pulse flex items-center text-bold p-2">
            {ownProfile ? "My Codats" : "Explore codats"}
          </div>
        </div>

        {/* Two-column layout for cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* First card - Yellow/Orange theme */}
          <div className="bg-blue-400/30 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="h-6 w-24 bg-blue-400/50 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-48 bg-blue-400/50 rounded animate-pulse mb-4"></div>
              <div className="bg-brown-900/50 rounded-md p-4">
                <div className="h-4 w-full bg-blue-400/50 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-blue-400/50 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-4/5 bg-blue-400/50 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center mt-4">
                <div className="h-6 w-6 bg-blue-400/50 rounded-full animate-pulse mr-2"></div>
                <div className="h-5 w-32 bg-blue-400/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Second card - Purple theme */}
          <div className="bg-purple-900/30 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="h-6 w-24 bg-purple-800/50 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-48 bg-purple-800/50 rounded animate-pulse mb-4"></div>
              <div className="bg-purple-900/50 rounded-md p-4">
                <div className="h-4 w-full bg-purple-800/50 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-purple-800/50 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-4/5 bg-purple-800/50 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center mt-4">
                <div className="h-6 w-6 bg-purple-800/50 rounded-full animate-pulse mr-2"></div>
                <div className="h-5 w-32 bg-purple-800/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Third card - Blue theme (darker) */}
          <div className="bg-blue-900/30 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="h-6 w-24 bg-blue-800/50 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-48 bg-blue-800/50 rounded animate-pulse mb-4"></div>
              <div className="bg-blue-900/50 rounded-md p-4">
                <div className="h-4 w-full bg-blue-800/50 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-blue-800/50 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/5 bg-blue-800/50 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center mt-4">
                <div className="h-6 w-6 bg-blue-800/50 rounded-full animate-pulse mr-2"></div>
                <div className="h-5 w-32 bg-blue-800/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Fourth card - Blue theme (lighter) */}
          <div className="bg-blue-800/30 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="h-6 w-24 bg-blue-700/50 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-48 bg-blue-700/50 rounded animate-pulse mb-4"></div>
              <div className="bg-blue-800/50 rounded-md p-4">
                <div className="h-4 w-full bg-blue-700/50 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-blue-700/50 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-2/3 bg-blue-700/50 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center mt-4">
                <div className="h-6 w-6 bg-blue-700/50 rounded-full animate-pulse mr-2"></div>
                <div className="h-5 w-32 bg-blue-700/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
