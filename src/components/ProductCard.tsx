"use client"

import styles from "./ProductCard.module.scss"
import ProductImagesSlider from "@/components/ProductImagesSlider"
import { useState } from "react"
import Link from "next/link"
import ProductCardVariantsSelectorList from "./ProductCardVariantsSelectorList"
import { Product } from "dukon-core-lib/library/common/types"
import { calculatePrices } from "@/util/calculatePrices"

interface ProductCardProps {
	product: Product
	storeID: string
}

export default function ProductCard({ product, storeID }: ProductCardProps) {
	const [imageKey, setImageKey] = useState(product.images.order[0])

	const prices = calculatePrices(product.variantsList)
	const { maxMp, minMp, maxSp, minSp } = prices
	const mp = maxMp === minMp ? "" + minMp : `${maxMp} - ${minMp}`
	const sp = maxSp === minSp ? "" + minSp : `${maxSp} - ${minSp}`

	return (
		<div key={"" + product._id} className={styles.product}>
			<Link href={"/shop/product/" + product._id}>
				<ProductImagesSlider
					product={product}
					moveToImageKey={imageKey}
					inheritedClassName={styles.productImagesSlider}
				/>
			</Link>
			<div className={styles.productInfo}>
				<h6>{product.name}</h6>
				<h6>
					₹{sp}{" "}
					{mp != sp && (
						<small>
							<s>₹{mp}</s>
						</small>
					)}
				</h6>
				{!!product?.primaryVariantType &&
					product.variants[product.primaryVariantType] && (
						<ProductCardVariantsSelectorList
							setImageKey={setImageKey}
							variants={product.variants[product.primaryVariantType]}
						/>
					)}
			</div>
		</div>
	)
}
