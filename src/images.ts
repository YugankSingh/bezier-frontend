import { mediaURL } from "dukon-core-lib/library/admin-frontend/mediaUrl"
import { Image } from "dukon-core-lib/library/common/types"
import websiteConfig from "./website.config"

const emptyImageObject: Image = {
	source: "s3",
	mimeType: "",
	uploadedAt: 0,
}

const images: Record<string, string> = {
	logo: "logo.png",
	buttonBg1: "button-bg-1.png",
	buttonBg2: "button-bg-2.png",
	fuhrer: "creepy-fuhrer.png",
	heroBanner: "bezierherobanner1.png",
}

Object.keys(images).forEach(
	(key: string) =>
		(images[key] = mediaURL(
			images[key],
			emptyImageObject,
			websiteConfig.storeID,
			"assets"
		))
)

export { images }
