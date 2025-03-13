import React from "react";

const ProfileLoaderSkeleton = () => {
  return (
    <div className="w-full flex justify-center bg-[#0F1729] p-5">
      <div className="w-full max-w-7.5xl bg-[#1A2035] rounded-lg ">
        <div className="px-8 py-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-700 animate-pulse border-2 border-gray-600"></div>

            <div className="flex-1">
              <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-2"></div>

              <div className="h-5 w-64 bg-gray-700/70 rounded animate-pulse"></div>
            </div>

            {/* Following/Followers section */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="h-5 w-20 bg-gray-700 rounded animate-pulse mb-2 mx-auto"></div>
                <div className="h-7 w-6 bg-gray-700 rounded animate-pulse mx-auto"></div>
              </div>

              <div className="text-center">
                <div className="h-5 w-20 bg-gray-700 rounded animate-pulse mb-2 mx-auto"></div>
                <div className="h-7 w-6 bg-gray-700 rounded animate-pulse mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLoaderSkeleton;
