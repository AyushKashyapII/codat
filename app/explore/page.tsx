import ExplorePage from "@/components/Pages/Explore";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Suspense } from "react";
import Loader from "@/components/loader";

const PageContent = async () => {
  const profile = await currentProfile();
  const userId = profile?.id;

  const allCodatTags = await db.codat.findMany({
    select: {
      codatTags: true,
    },
    where: {
      codatIsPublic: true,
    },
  });

  const allTags = [
    ...new Set(allCodatTags.flatMap((codat) => codat.codatTags)),
  ];

  if (!profile) {
    return (
      <ExplorePage
        createdCodatTags={[]}
        savedCodatTags={[]}
        initialRecommendedCodats={[]}
        isGuest={true}
        allTags={allTags}
      />
    );
  }

  const createdCodats = await db.codat.findMany({
    where: { authorId: userId },
    select: { codatTags: true },
  });

  const savedCodats = await db.profile.findUnique({
    where: { id: userId },
    select: { codatsSaved: { select: { codatTags: true } } },
  });

  const createdCodatTags = createdCodats
    ? [...new Set(createdCodats.flatMap((codat) => codat.codatTags))]
    : [];
  const savedCodatTags = savedCodats
    ? [...new Set(savedCodats.codatsSaved.flatMap((codat) => codat.codatTags))]
    : [];

  const userTags = [...new Set([...createdCodatTags, ...savedCodatTags])];

  const recommendedCodats = await db.codat.findMany({
    where: {
      codatTags: { hasSome: userTags },
      codatIsPublic: true,
      authorId: { not: userId },
    },
    select: {
      codatId: true,
      codatName: true,
      codatTags: true,
      codatDescription: true,
      codatLikes: true,
      codatCode: true,
      codatLanguage: true,
      codatAIDesc: true,
      codatAuthor: true,
    },
    orderBy: { codatLikes: "desc" },
    take: 10,
  });

  return (
    <ExplorePage
      createdCodatTags={createdCodatTags}
      savedCodatTags={savedCodatTags}
      initialRecommendedCodats={recommendedCodats}
      isGuest={false}
      allTags={allTags}
    />
  );
};

const Page = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Explore Codats</h1>
      <Suspense fallback={<Loader />}>
        <PageContent />
      </Suspense>
    </div>
  );
};

export default Page;
