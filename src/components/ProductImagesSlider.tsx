"use client"
import { useEffect, useMemo, useRef } from "react"
import styles from "./ProductImagesSlider.module.scss"
import { ImageKey, Product } from "dukon-core-lib/library/common/types"
import DisplayImage from "./DisplayImage"
import websiteConfig from "@/website.config"

interface ProductImagesSliderProps {
	product: Product
	moveToImageKey?: ImageKey
	inheritedClassName?: Object
}

export default function ProductImagesSlider({
	product,
	moveToImageKey,
	inheritedClassName,
}: ProductImagesSliderProps) {
	const sliderRef = useRef<HTMLDivElement | null>(null)
	const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

	const orderedImages = useMemo(() => product.images.order, [product.images.order])

	useEffect(() => {
		if (!moveToImageKey) return
		const targetNode = itemRefs.current[moveToImageKey]
		if (targetNode) {
			targetNode.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center",
			})
		}
	}, [moveToImageKey, orderedImages])

	return (
		<div
			ref={sliderRef}
			className={`${styles.slider} ${inheritedClassName || ""}`}
		>
			{orderedImages.map(imageKey => {
				const imageObject = product.images.list[imageKey]
				return (
					<div
						className={styles.sliderItem}
						key={imageKey}
						ref={node => {
							itemRefs.current[imageKey] = node
						}}
					>
						<DisplayImage
							imageKey={imageKey}
							image={imageObject}
							storeID={websiteConfig.storeID}
							mediaType="productImages"
							altText={product.name + " Preview"}
						/>
					</div>
				)
			})}
		</div>
	)
}
