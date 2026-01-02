import { NextApiRequest, NextApiResponse } from "next"

let cachedUserData: any = null
let lastCacheTime: number | null = null
const CACHE_DURATION: number = 3 // Cache duration in seconds (1 hour)

async function fetchUserData() {
	const apiRes = await fetch("https://randomuser.me/api", {
		cache: "no-cache", // Avoid caching the response locally
	})
	const user = (await apiRes.json()).results[0]
	return user
}

export default async function randomUser() {
	try {
		// Check if the cache is expired or not initialized
		if (
			!cachedUserData ||
			(lastCacheTime && Date.now() - lastCacheTime > CACHE_DURATION * 1000)
		) {
			cachedUserData = await fetchUserData()
			lastCacheTime = Date.now()
		}

		// res.setHeader('Cache-Control', 'max-age=' + CACHE_DURATION); // Set caching header

		return cachedUserData.name
	} catch (error) {
		console.error("Error fetching user data:", error)
		return false
	}
}
