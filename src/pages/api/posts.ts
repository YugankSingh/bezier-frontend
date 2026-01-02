import { NextApiRequest, NextApiResponse } from 'next';

let cachedUserData: any = null;
let lastCacheTime: number | null = null;
const CACHE_DURATION: number = 3; // Cache duration in seconds (1 hour)

async function fetchUserData() {
    const apiRes = await fetch("https://randomuser.me/api", {
        cache: "no-cache" // Avoid caching the response locally
    });
    const user = (await apiRes.json()).results[0];
    return user;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Check if the cache is expired or not initialized
        if (!cachedUserData || (lastCacheTime && Date.now() - lastCacheTime > CACHE_DURATION * 1000)) {
            cachedUserData = await fetchUserData();
            lastCacheTime = Date.now();
        }
        
        // res.setHeader('Cache-Control', 'max-age=' + CACHE_DURATION); // Set caching header
        
        res.status(200).json({ message: "Hello from API!", user: cachedUserData.name });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
