import ExplorePage from "@/components/Pages/Explore";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db"; 

const page = async () => {

    const profile = await currentProfile();
    const userId = profile?.id;

    if(!profile){
        return <ExplorePage 
            createdCodatTags={[]} 
            savedCodatTags={[]} 
            initialRecommendedCodats={[]}
            isGuest={true}
            />;
    }

    const createdCodats = await db.codat.findMany({
        where: { authorId: userId },
        select: { codatTags: true },
    });

    const savedCodats = await db.profile.findUnique({
        where: { id: userId },
        select: { codatsSaved: { select: { codatTags: true } } },
    });
    const createdCodatTags = createdCodats ? [...new Set(createdCodats.flatMap(codat => codat.codatTags))] : [];
    const savedCodatTags = savedCodats ? [...new Set(savedCodats.codatsSaved.flatMap(codat => codat.codatTags))] : [];

    const allTags = [...new Set([...createdCodatTags, ...savedCodatTags])];

    const recommendedCodats = await db.codat.findMany({
        where: {
            codatTags: { hasSome: allTags },
            codatIsPublic: true,
            authorId: { not: userId },
        },
        orderBy: { codatLikes: "desc" },
        });

    return <ExplorePage 
    createdCodatTags={createdCodatTags} 
    savedCodatTags={savedCodatTags} 
    initialRecommendedCodats={recommendedCodats}
    isGuest={false}
    />;
};

export default page;
