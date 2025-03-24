import ProfilePage from "@/components/Pages/ProfilePage";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  console.log(username);
  const usedUsername = decodeURIComponent(username);

  const profile = await db.profile.findUnique({
    where: {
      name: usedUsername,
    },
    include: {
      codatsAuthored: true,
      codatsSaved: true,
      teamsPartsOf: true,
      teamsOwnerOf: true,
      teamsModeratorOf: true,
      codatsCollections: {
        include: {
          collectionCodats: true,
        },
      },
      usersFollowed: {
        include: {
          following: true,
        },
      },
      usersFollowing: {
        include: {
          follower: true,
        },
      },
    },
  });

  if (!profile) {
    return <div>Not Found</div>;
  }

  return (
    <ProfilePage
      fullProfile={profile}
      fullcollections={profile.codatsCollections}
      fullFollowers={profile.usersFollowed}
      fullFollowing={profile.usersFollowing}
    />
  );
};
export default page;
