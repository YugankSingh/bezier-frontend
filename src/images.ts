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
	fatguyOffended: "fatguy-offended-removebg-preview.png",
	gayOffended: "gay-offended-removebg-preview.png",
	groupOffended: "group-offended-removebg-preview.png",
	feministOffended: "feminist-offended-removebg-preview.png",
	mockup1: "b4a293fa-47ae-4583-a567-6d992ed8b0ed-removebg-preview.png",
	mockup2: "4b80c417-524e-49bd-ae13-450dce0789b2-removebg-preview.png",
	mockup3: "3419f9c6-4244-4639-b765-a2d9ea261600-removebg-preview.png",
	mockup4: "c26de7e1-88cb-4c88-81ab-55426b96fd3a-removebg-preview.png",
	buttonBg1: "button-bg-1.png",
	buttonBg2: "button-bg-2.png",
	fuhrer: "creepy-fuhrer.png",
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
