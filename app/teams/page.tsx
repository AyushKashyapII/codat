import TeamsPage from "@/components/Pages/TeamsPage";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const Page = async () => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return <div>Not found</div>;
    }

    const teams = await db.teams.findMany({
      where: {
        OR: [
          { teamMembers: { some: { id: profile.id } } },
          { teamModerators: { some: { id: profile.id } } },
          { teamOwnerId: profile.id },
        ],
      },
      select: {
        teamId: true,
        teamName: true,
        teamMembers: { select: { id: true } },
        teamModerators: { select: { id: true } },
        teamOwnerId: true,
      },
    });

    return <TeamsPage Teams={teams} />;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return <div>Error loading teams</div>;
  }
};

export default Page;
