import CollectionsPage from "@/components/Pages/CollectionUser";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {auth} from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

const page = async () => {
  const { userId } = await auth();

  if(!userId){
    redirect('/')
  }

  const collections = await db.collections.findMany({
    where: {
      collectionOwnerId: userId
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