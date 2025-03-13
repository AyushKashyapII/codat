import { create } from "zustand";

interface Codat {
  codatId: string;
  codatName: string;
  codatDescription: string;
  codatLanguage: string;
  codatCode: string;
  codatIsPublic: boolean;
  codatAIDesc: string;
  codatAIFunc: string;
  codatTags:string[];
  codatLikes: number;
  createdAt: Date;
  updatedAt: Date;
  codatAuthor: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

interface AiSearcher {
  aiId: string;
  textToPassToAI: object;
}

interface Teams {
  teamId: string;
  teamName: string;
}

interface Collection {
  collectionName: string;
  collectionDesc: string;
  collectionCodats: {
    codatName: string;
    codatDescription: string;
    codatLanguage: string;
    codatId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
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
  teamsPartsOf: Teams[];
  teamsOwnerOf: Teams[];
  teamsModeratorOf: Teams[];
  codatsAuthored: Codat[];
  codatsSaved: Codat[];
  codatsCollections: Collection[];
  usersFollowed: UserFollow[];
  usersFollowing: UserFollow[];
}

interface ModelStore {
  profile: Profile | null;
  codat: Codat | null;
  codatsCollections: AllCollections | null;
  singleCodatCollection: Collection | null;

  setProfile: (profile: Profile) => void;
  setCodat: (codat: Codat) => void;
  setAllCodatsCollections: (codatsCollections: AllCollections | null) => void;
  setSingleCodatCollection: (codatCollection: Collection | null) => void;
  setEditProfile:(club:Profile) => void;
}

export const useModel = create<ModelStore>((set) => ({
  profile: null,
  codat: null,
  codatsCollections: null,
  singleCodatCollection: null,

  setProfile: (profile) => set({ profile }),
  setCodat: (codat) => set({ codat }),
  setAllCodatsCollections: (codatsCollections) => set({ codatsCollections }),
  setSingleCodatCollection: (singleCodatCollection) => set({ singleCodatCollection }),
  setEditProfile:(profile) => set({profile})
}));
