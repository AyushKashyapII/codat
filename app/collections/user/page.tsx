import CollectionsPage from "@/components/Pages/CollectionUser";
import ProfilePage from "@/components/Pages/ProfilePage";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const page = async () => {
  const profile = await currentProfile();

  if(!profile){
    redirect('/')
  }

  const collections = await db.collections.findMany({
    where: {
      collectionOwnerId: profile.id
    },
    select: {
      collectionId: true,
      collectionName: true,
      collectionDesc: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { collectionCodats: true },
      },
    }
  })
  

  return (
    <CollectionsPage
    fullCollections={collections}
    />
  );
}
export default page;