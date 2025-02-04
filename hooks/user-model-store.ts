import { Codat, Collections } from "@prisma/client";
import { create } from "zustand";

interface AiSearcher {
  aiId: string;
  textToPassToAI: object;
}

interface Teams {
  teamId: string;
  teamName: string;
}

interface AllCollections {
  collectionId: string;
  collectionName: string;
  collectionDesc: string;
}

interface UserFollow {
  id: string;
  following: { id: string; name: string };
}

interface Profile {
  id: string;
  email: string;
  phoneNumber?: string;
  name?: string;
  image?: string;
  attachedAiSearcher?: AiSearcher;
  teamsPartsOf: Teams[];
  teamsOwnerOf: Teams[];
  teamsModeratorOf: Teams[];
  codatsAuthored: Codat[];
  codatsSaved: Codat[];
  codatsCollections: AllCollections[];
  singleCodatCollection: Collections | null;
  usersFollowed: UserFollow[];
  usersFollowing: UserFollow[];
}

interface ModelStore {
  profile: Profile | null;
  codat: Codat | null;
  codatsCollections: AllCollections | null;
  singleCodatCollection: Collections | null;
  setProfile: (profile: Profile) => void;
  setCodat: (codat: Codat) => void;
  setAllCodatsCollections: (codatsCollections: AllCollections | null) => void;
  setSingleCodatCollections: (codatCollection: Collections | null) => void;
}

export const useModel = create<ModelStore>((set) => ({
  profile: null,
  codat: null,
  codatsCollections: null,
  singleCodatCollection: null,

  setProfile: (profile) => set({ profile }),
  setCodat: (codat) => set({ codat }),
  setAllCodatsCollections: (codatsCollections) => set({ codatsCollections }),
  setSingleCodatCollections: (singleCodatCollection) =>set({ singleCodatCollection }),
}));
