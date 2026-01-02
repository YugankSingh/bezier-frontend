import React from "react"
import ProductVariantSelector from "./ProductVariantSelector"
import {
	Product,
	Variant,
	VariantObject,
} from "dukon-core-lib/library/common/types"
import {
	destringifyVariant,
	getVariantMapList,
} from "dukon-core-lib/library/common/util/variants"

type VariantViewSmallProps = {
	quantity: number
	variantListKey: string
	product: Product
	showQuantity?: boolean
}

function VariantViewSmall({
	quantity,
	variantListKey,
	product,
	showQuantity = true,
}: VariantViewSmallProps) {
	destringifyVariant

	const { variant: variantObject, productID } =
		destringifyVariant(variantListKey)

	if (productID !== product._id)
		return <p className="error">Invalid Cart Item</p>
	let variantsMap
	try {
		variantsMap = getVariantMapList(
			variantObject,
			product.variants,
			product.variantsOrder
		)
	} catch (e) {
		if (
			e instanceof Error &&
			e.message === "Invalid Variants and VariantsOrder provided"
		) {
			return <></>
		}
		throw e
	}
	return (
		<div
			style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
		>
			{variantsMap.map((variantMapObject, index) => {
				const { variant, variantType, variantKey } = variantMapObject
				return (
					<ProductVariantSelector
						key={variantType + "-" + variantKey}
						variantKey={variantKey}
						variant={variant}
						selectVariant={() => {}}
						isSelected={false}

						// color={variant.color || ""}
						// buttonText={variant.text}
						// id={"variant" + Math.floor(Math.random() * 100000)}
						// key={variantType + variantType + index}
						// changeVariant={() => {}}
						// tooltipText={variantType + " : " + variant.name}
						// index={index}
						// isSelected={false}
						// isLast={false}
						// inheritedStyles={{
						// 	height: "38px",
						// 	minWidth: "38px",
						// 	paddingLeft: "0px",
						// 	fontSize: "10px",
						// }}
					/>
				)
			})}
			{!!showQuantity && <p>&nbsp; × &nbsp;{quantity} </p>}
		</div>
	)
}

export default VariantViewSmall
