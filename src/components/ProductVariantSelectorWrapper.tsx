import styles from "./ProductVariantSelectorWrapper.module.scss"
import ProductVariantSelector from "./ProductVariantSelector"
import {
	Product,
	Variant,
	VariantKey,
	VariantsInnerWrapper,
} from "dukon-core-lib/library/common/types"
import { useState } from "react"

interface ProductVariantSelectorWrapperProps {
	productID: string
	variantsInnerWrapper: VariantsInnerWrapper
	variantType: VariantKey
	onVariantKeyUpdate: (variantKey: VariantKey) => void
	selectedVariantKey: VariantKey | null
}

export default function ProductVariantSelectorWrapper({
	productID,
	variantsInnerWrapper: { variantsInner, variantsInnerOrder },
	variantType,
	onVariantKeyUpdate,
	selectedVariantKey,
}: ProductVariantSelectorWrapperProps) {
	return (
		<div className={styles.colorsWrapper}>
			<div className={styles.colorsHeading}>
				{variantType} - <small>{selectedVariantKey || ""}</small>
			</div>
			<div className={styles.colorsContainer}>
				{variantsInnerOrder.map((variantKey, index) => {
					let variant = variantsInner[variantKey]
					return (
						<>
							
							<ProductVariantSelector
								key={variantKey}
								variantKey={variantKey}
								variant={variant}
								isSelected={
									selectedVariantKey !== null &&
									selectedVariantKey === variantKey
								}
								selectVariant={() => {
									onVariantKeyUpdate(variantKey)
								}}
							/>
						</>
					)
				})}
			</div>
		</div>
	)
}
