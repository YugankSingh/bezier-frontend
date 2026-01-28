import { adminConfig } from "dukon-core-lib/library/admin-frontend/admin.config"
import { WebsiteConfig } from "dukon-core-lib/library/common/types"

const environment = adminConfig.environment
const variableConfig = {
	frontendOrigin: "http://localhost:3000",
}

if (environment === "frontend-dev") {
	// keep default localhost
}

if (environment === "preview") {
	variableConfig["frontendOrigin"] = "https://dev.bezier.dukon.in"
}

if (environment === "production") {
	variableConfig["frontendOrigin"] = "https://bezier.dukon.in"
}

const websiteConfig: WebsiteConfig = {
	name: "Bezier",
	storeID: "bezier",
	...variableConfig,
}

export default websiteConfig
