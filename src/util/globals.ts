import {
	adminConfig,
	functionsUrl,
} from "dukon-core-lib/library/admin-frontend/admin.config"
import { Product } from "dukon-core-lib/library/common/types"
import { callFunction } from "dukon-core-lib/library/frontend/util/callFunction"
import websiteConfig from "@/website.config"
import getWebsiteConfig from "dukon-core-lib/library/frontend/websiteConfig"
// import websiteConfig from "@/website.config"

export async function fetchProductsList(): Promise<Product[]> {
	console.log("Refetching products list")
	const apiRes = await callFunction(
		"fetchAllProductsBasicInfo",
		{ frontend_server_key: process.env.FRONTEND_SERVER_KEY },
		false,
		getWebsiteConfig().storeID
	)
	
	if (!apiRes) {
		console.error("Invalid response from server, while fetching productList")
		return []
	}

	console.log("apiRes", JSON.stringify(apiRes, null, 2))

	if (!apiRes.success || !apiRes.data) {
		console.error(
			"Unsuccessful response from server, owhile fetching productList",
			JSON.stringify(apiRes, null, 2)
		)
		return []
	}
	console.info("allProductsBasic", apiRes.success, apiRes.message)

	return apiRes.data.products
}
