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

            router.push(`/profile/id/${user.id}`);
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
        <>
        {/* Logo */}
        <div
            className="text-3xl font-bold tracking-tight cursor-pointer hover:text-gray-300 transition-colors duration-300"
            onClick={() => redirect('/')}
        >
            Codat
        </div>

        {/* Navigation Buttons */}
        {/* <div className="flex items-center space-x-6">
            {navButtons.map(
            ({ icon: Icon, label, hoverColor, activeColor, url }) => (
                <button
                key={label}
                className={`group flex items-center space-x-3 
                text-gray-200 
                ${hoverColor} ${activeColor}
                transition-all duration-300 
                transform hover:scale-105 active:scale-95 
                rounded-lg p-2
                relative`}
                onClick={() => router.push(url)}
                >
                <Icon
                    size={22}
                    className="transition-transform duration-300
                    group-hover:-translate-y-1"
                />
                <span className="font-medium tracking-wide">{label}</span>
                </button>
            )
            )}
        </div> */}

        {/* Search Bar */}
        <div className="flex items-center space-x-6">
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
            className="w-[30vw] h-8 p-2 rounded-lg text-black"
            />
            <button onClick={gettingTheCodat}>
            <Search
                size={22}
                className="text-gray-400 hover:text-white transition-colors"
            />
            </button>
        </div>

        {/* create a codat button  */}
        <div className="flex items-center space-x-6">
            <button
            className="flex items-center space-x-3 
                text-gray-200 
                hover:text-blue-500 hover:bg-blue-500/10
                active:text-blue-600 active:bg-blue-600/20
                transition-all duration-300 
                transform hover:scale-105 active:scale-95 
                rounded-lg p-2
                "
            onClick={() => router.push("/add")}
            >
            <User
                size={22}
                className="transition-transform duration-300
                    group-hover:-translate-y-1"
            />
            <span className="font-medium tracking-wide">Create a Codat</span>
            </button>
        </div>

        <div className="flex items-center space-x-4">
            <button
            className="flex items-center space-x-3 
                text-gray-200 
                hover:text-blue-500 hover:bg-blue-500/10
                active:text-blue-600 active:bg-blue-600/20
                transition-all duration-300 
                transform hover:scale-105 active:scale-95 
                rounded-lg p-2
                "
            onClick={() => {    
                console.log(profile.name);
                        
                const profilePath = `/profile/${profile.name}`
                router.push(profilePath);
            }}
            >
            <LayoutDashboard
                size={22}
                className="transition-transform duration-300
                    group-hover:-translate-y-1"
            />
            <span className="font-medium tracking-wide">Dashboard</span>
            </button>
        </div>

        {/* Profile */}
        <AuthButton />
        </>
    );
    };

    export default NavbarClient;
