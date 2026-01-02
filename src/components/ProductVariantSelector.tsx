"use client"
import { useState } from "react"
import styles from "./ProductVariantIcon.module.scss"
import { Variant, VariantKey } from "dukon-core-lib/library/common/types"
import invertColor from "dukon-core-lib/library/admin-frontend/util/colorInverter"

interface ProductVariantSelectorProps {
	variantKey: VariantKey
	variant: Variant
	selectVariant: () => void
	isSelected: boolean
	inheritedStyles?: object
	isLast?: boolean
}

export default function ProductVariantSelector({
	variantKey,
	variant,
	selectVariant,
	isSelected,
	inheritedStyles = {},
	isLast = false,
}: ProductVariantSelectorProps) {
	if (!variant) return <h1>Loading...</h1>
	let { color = "#ffffff", text: buttonText = "" } = variant

	if (color === "#ffffff" && buttonText) {
		color = "#000000"
	}
	const tooltipText = variantKey

	return (
		<div
			className={`${styles.selectorWrapper} ${
				isSelected ? styles.selected : styles.normal
			} ${!!buttonText ? "" : styles.selectorRound}`}
			style={inheritedStyles}
		>
			<button
				className={styles.selector}
				title={isLast ? "More" : tooltipText}
				style={{
					backgroundColor: color,
					color: invertColor(color),
				}}
				onClick={() => selectVariant()}
			>
				{isLast ? "+" : buttonText}
			</button>
		</div>
	)
}
