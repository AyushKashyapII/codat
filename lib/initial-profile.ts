import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  console.log(user);
  
  
  if (!user) {
    return ;
  }

  const profile = await db.profile.findUnique({
    where: { id: user.id }
  });

  if (profile) {
    return profile;
  }

  let nameProfile = '';
    if (user.firstName && user.lastName) {
        nameProfile = `${user.firstName} ${user.lastName}`;
    } else {
        nameProfile = `${user.username}`;
    }

  const newProfile = await db.profile.create({
    data: {
      id: user.id,
      name: nameProfile,
      image: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  });

  await db.aiSearcher.create({
    data: {
      attachedProfileId: newProfile.id
    }
  });

  return newProfile;
};