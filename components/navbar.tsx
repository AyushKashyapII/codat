import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import NavbarClient from "./navbar-client";

const Navbar = async () => {
  const profile = await currentProfile();  
  return (
    <nav className="flex items-center justify-between px-6 py-5 bg-black text-white h-20">
      <NavbarClient profile={profile} />
    </nav>
  );
};

export default Navbar;
