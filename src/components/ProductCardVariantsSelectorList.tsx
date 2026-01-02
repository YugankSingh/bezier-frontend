"use client"
import styles from "./ProductCard.module.scss"
import { useEffect, useState } from "react"
import ProductVariantSelector from "./ProductVariantSelector"
import {
	ImageKey,
	VariantKey,
	Variants,
	VariantsInnerWrapper,
} from "dukon-core-lib/library/common/types"

interface ProductCardVariantsSelectorList {
	variants: VariantsInnerWrapper
	setImageKey: (imageKey: ImageKey) => void
}

export default function ProductCardVariantsSelectorList({
	variants,
	setImageKey,
}: ProductCardVariantsSelectorList) {
	if (!variants) throw new Error("Variants object is empty")
	const { variantsInner, variantsInnerOrder } = variants

	const [selectedVariantID, setSelectedVariantID] = useState("")

	useEffect(() => {
		if (!window) return
		const currImageKey =
			variants.variantsInner[selectedVariantID]?.imageKeys?.[0]
		if (currImageKey) setImageKey(currImageKey)
	}, [selectedVariantID])

	// const [variantID, setVariantID] = useState(variantsArray[0] || "")

	return (
		variantsInnerOrder.length && (
			<div className={styles.colorSelector}>
				{variantsInnerOrder.map((currVariantID: VariantKey, index: number) => {
					const variant = variantsInner[currVariantID]
					return (
						index < 5 && (
							<ProductVariantSelector
								variant={variant}
								isSelected={currVariantID === selectedVariantID}
								selectVariant={() => {
									setSelectedVariantID(currVariantID)
								}}
								variantKey={currVariantID}
								key={"variantID" + currVariantID}
							/>
						)
					)
				})}
			</div>
		)
	)
}
