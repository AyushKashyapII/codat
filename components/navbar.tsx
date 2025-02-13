"use client"

import React from 'react';
import { Home, Users, Search, User } from 'lucide-react';
import {useRouter} from "next/navigation";
import { AuthButton } from './AuthButton';

const Navbar = () => {
  const router = useRouter();
  const navButtons = [
    {
      icon: Home,
      label: 'Collections',
      hoverColor: 'hover:text-blue-500 hover:bg-blue-500/10',
      activeColor: 'active:text-blue-600 active:bg-blue-600/20',
      url: "/collections",
    },
    {
      icon: Users,
      label: 'Followers',
      hoverColor: 'hover:text-green-500 hover:bg-green-500/10',
      activeColor: 'active:text-green-600 active:bg-green-600/20',
      url: "/followers"
    },
    {
      icon: Users,
      label: 'Following',
      hoverColor: 'hover:text-purple-500 hover:bg-purple-500/10',
      activeColor: 'active:text-purple-600 active:bg-purple-600/20',
      url: "/followings"
    },
    {
      icon: Search,
      label: 'Search',
      hoverColor: 'hover:text-red-500 hover:bg-red-500/10',
      activeColor: 'active:text-red-600 active:bg-red-600/20',
      url: "/search"
    }
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-5 bg-black text-white h-20">
      {/* Logo */}
      <div className="text-3xl font-bold tracking-tight cursor-pointer hover:text-gray-300 transition-colors duration-300">
        Codat
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-6">
        {navButtons.map(({ icon: Icon, label, hoverColor, activeColor, url }) => (
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
            <span className="font-medium tracking-wide">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Profile */}
      <AuthButton/>
    </nav>
  );
};

export default Navbar;