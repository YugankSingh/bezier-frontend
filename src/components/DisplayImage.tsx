import websiteConfig from "@/website.config"
import { mediaURL } from "dukon-core-lib/library/admin-frontend/mediaUrl"
import { Image, MediaTypeNames } from "dukon-core-lib/library/common/types"
import { useEffect, useState } from "react"

const grayImage =
	"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAcHBwcIBwgJCQgMDAsMDBEQDg4QERoSFBIUEhonGB0YGB0YJyMqIiAiKiM+MSsrMT5IPDk8SFdOTldtaG2Pj8ABBwcHBwgHCAkJCAwMCwwMERAODhARGhIUEhQSGicYHRgYHRgnIyoiICIqIz4xKysxPkg8OTxIV05OV21obY+PwP/CABEIASYBJgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABv/aAAgBAQAAAACmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//8QAFBABAAAAAAAAAAAAAAAAAAAAoP/aAAgBAQABPwArP//EABQRAQAAAAAAAAAAAAAAAAAAAID/2gAIAQIBAT8ANP8A/8QAFBEBAAAAAAAAAAAAAAAAAAAAgP/aAAgBAwEBPwA0/wD/2Q=="

function DisplayImage({
	image,
	imageKey,
	mediaType,
	storeID = websiteConfig.storeID,
	className = "",
	altText = "",
	loadingImageUrl,
	onClick = () => {},
}: {
	image?: Image
	imageKey?: string
	mediaType: MediaTypeNames
	storeID?: string
	className?: string
	altText?: string
	loadingImageUrl?: string
	onClick?: () => any
}) {
	const [source, setSource] = useState(loadingImageUrl || grayImage)
	// const app = useStoreState(state => state.app)

	useEffect(() => {
		if (!image || !imageKey) {
			setSource(loadingImageUrl || grayImage)
			return
		}
		// if (image.source === "firebaseStorage") {
		// if (!app) return
		// 	setSource(imageURL(imageKey, image, app.options.projectId))
		// } else {
		setSource(mediaURL(imageKey, image, storeID, mediaType))
		// }
	}, [image, imageKey, loadingImageUrl, mediaType, storeID])

	return (
		<img
			src={source}
			alt={altText || "loading...."}
			className={className}
			onClick={onClick}
		/>
	)
}

export default DisplayImage
