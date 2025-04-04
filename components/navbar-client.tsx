"use client";

import React from "react";
import { Home, Users, Search, User, LayoutDashboard } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthButton } from "./AuthButton";

const NavbarClient = ({ profile }: { profile: any }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect with more sensitive detection
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 5; // More sensitive scroll detection
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const gettingTheCodat = async () => {
    try {
      if (!searchQuery.trim()) return;

      if (searchQuery.startsWith("@")) {
        const username = searchQuery.substring(1);
        const response = await fetch(`/api/search/${username}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const users = await response.json();
        console.log("API response:", users);

        if (!users || users.length === 0) {
          console.error("No user found with that username");
          return;
        }
        const user = users[0];

        router.push(`/profile/${user.name}`);
      } else {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data, "dataaaaaa");

        if (!data || !data.codatId) {
          console.error("No codat found with that query");
          return;
        }

        router.push(`/codat/${data.codatId}`);
      }
    } catch (error) {
      console.error("Error in search:", error);
    }
  };

  const navButtons = [
    {
      icon: Home,
      label: "Collections",
      hoverColor: "hover:text-blue-500 hover:bg-blue-500/10",
      activeColor: "active:text-blue-600 active:bg-blue-600/20",
      url: "/collections",
    },
    {
      icon: Users,
      label: "Followers",
      hoverColor: "hover:text-green-500 hover:bg-green-500/10",
      activeColor: "active:text-green-600 active:bg-green-600/20",
      url: "/followers",
    },
    {
      icon: Users,
      label: "Following",
      hoverColor: "hover:text-purple-500 hover:bg-purple-500/10",
      activeColor: "active:text-purple-600 active:bg-purple-600/20",
      url: "/followings",
    },
    {
      icon: Users,
      label: "Teams",
      hoverColor: "hover:text-orange-500 hover:bg-orange-500/10",
      activeColor: "active:text-orange-600 active:bg-orange-600/20",
      url: "/teams",
    },
    {
      icon: Search,
      label: "Search",
      hoverColor: "hover:text-red-500 hover:bg-red-500/10",
      activeColor: "active:text-red-600 active:bg-red-600/20",
      url: "/search",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full  transition-all duration-500 ease-in-out z-50 
      ${
        scrolled
          ? "bg-gray-800/45 backdrop-blur-lg shadow-lg border-b border-gray-700/30 py-5 mt-4 rounded-xl mx-6 w-[calc(100%-3rem)] h-38"
          : "bg-transparent py-6"
      }`}
    >
      <div
        className={`mx-auto px-6 flex items-center justify-between transition-all duration-500 ease-in-out
     ${scrolled ? "max-w-6xl" : "max-w-7xl"}`}
      >
        {/* Logo */}
        <div
          className={`font-bold tracking-tight cursor-pointer hover:text-gray-300 transition-all duration-500 ease-in-out
                    ${scrolled ? "text-2xl" : "text-3xl"}`}
          onClick={() => router.push("/")}
        >
          Codat 
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-3">
          <div
            className={`relative transition-all duration-500 ease-in-out rounded-lg overflow-hidden
                         ${scrolled ? "shadow-md" : ""}`}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  gettingTheCodat();
                }
              }}
              className={`transition-all duration-500 ease-in-out p-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${scrolled ? "w-[25vw] h-8" : "w-[35vw] h-10"}`}
            />
            <button
              onClick={gettingTheCodat}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors hover:text-blue-500"
            >
              <Search
                size={scrolled ? 18 : 22}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              />
            </button>
          </div>
        </div>

        {/* Buttons Container */}
        <div className="flex items-center space-x-5">
          {/* Create a Codat Button */}
          <button
            className={`flex items-center gap-2 
                    text-gray-200 
                    hover:text-blue-500 hover:bg-blue-500/15
                    active:text-blue-600 active:bg-blue-600/25
                    transition-all duration-500 ease-in-out
                    transform hover:scale-105 active:scale-95 
                    rounded-lg ${scrolled ? "p-2 text-sm" : "p-3 text-base"}`}
            onClick={() => router.push("/add")}
          >
            <User
              size={scrolled ? 18 : 22}
              className="transition-transform duration-300 group-hover:-translate-y-1"
            />
            <span className="font-medium tracking-wide whitespace-nowrap">
              {scrolled ? "Create" : "Create a Codat"}
            </span>
          </button>

          {/* Dashboard Button */}
          <button
            className={`flex items-center gap-2
                    text-gray-200 
                    hover:text-blue-500 hover:bg-blue-500/15
                    active:text-blue-600 active:bg-blue-600/25
                    transition-all duration-500 ease-in-out
                    transform hover:scale-105 active:scale-95 
                    rounded-lg ${scrolled ? "p-2 text-sm" : "p-3 text-base"}`}
            onClick={() => {
              console.log(profile.name);
              const profilePath = `/profile/${profile.name}`;
              router.push(profilePath);
            }}
          >
            <LayoutDashboard
              size={scrolled ? 18 : 22}
              className="transition-transform duration-300 group-hover:-translate-y-1"
            />
            <span className="font-medium tracking-wide">Dashboard</span>
          </button>

          {/* Profile */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              scrolled ? "scale-95" : "scale-100"
            }`}
          >
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarClient;
