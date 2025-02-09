import EditProfile from "@/components/Pages/EditProfile";
import HomePage from "@/components/Pages/Home";
import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";

const page = async() => {
  const profile = await currentProfile();
    
  if(!profile){    
    return (await auth()).redirectToSignIn();
  }

  return (
  <EditProfile
          name={profile?.name as string} 
          phoneNumber={profile?.phoneNumber as string}
          image={profile?.image as string}
          email={profile.email as string}
  />)
}

export default page;