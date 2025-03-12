"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const TAG_STORAGE_KEY = "visitedTags";

interface ExplorePageProps {
    savedCodatTags: string[];
    createdCodatTags: string[];
    initialRecommendedCodats: { codatId: string; codatName: string; codatTags: string[] }[];
    isGuest: boolean;
}

const getTagsFromLocalStorage = () => {
    if (typeof window === "undefined") return [];
    const storedData = JSON.parse(localStorage.getItem(TAG_STORAGE_KEY) || "{}");
    return storedData.tags || [];
};

function ExplorePage({ savedCodatTags, createdCodatTags, initialRecommendedCodats, isGuest }: ExplorePageProps) {
    const [visitedTags, setVisitedTags] = useState<string[]>([]);
    const [recommendedCodats, setRecommendedCodats] = useState(initialRecommendedCodats);

    useEffect(() => {
        if (!isGuest) return;
        const tags = getTagsFromLocalStorage();
        setVisitedTags(tags);

        const fetchGuestRecommendations = async () => {
            if (tags.length === 0) return;
            try {
                const res = await axios.post("/api/codat/recommend-codats", { tags });
                setRecommendedCodats(res.data);
            } catch (error) {
                console.error("Failed to fetch recommendations for guest user:", error);
            }
        };

        fetchGuestRecommendations();
    }, [isGuest]);

    return (
        <>
            <div>Saved Codats: {savedCodatTags.join(", ")}</div>
            <div>Created Codats: {createdCodatTags.join(", ")}</div>
            <div>Visited Tags: {visitedTags.join(", ")}</div>

            <h2>Recommended Codats:</h2>
            <ul>
                {recommendedCodats.map((codat) => (
                    <li key={codat.codatId}>
                        <strong>{codat.codatName}</strong> - Tags: {codat.codatTags.join(", ")}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ExplorePage;
