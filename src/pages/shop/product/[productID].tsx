import React, { useState, useEffect } from "react"
import styles from "./Product.module.scss"
import ProductImagesSlider from "@/components/ProductImagesSlider"
import { doc, getDoc } from "firebase/firestore"
import toast from "react-hot-toast"
import {
	Product,
	SelectedVariants,
	VariantKey,
	VariantType,
} from "dukon-core-lib/library/common/types"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import { adminConfig } from "dukon-core-lib/library/admin-frontend/admin.config"
import websiteConfig from "@/website.config"
import { GetStaticPropsContext } from "next"
import { stringifyVariant } from "dukon-core-lib/library/common/util/variants"
import ProductVariantSelectorWrapper from "@/components/ProductVariantSelectorWrapper"
import AddToCartButton from "@/components/AddToCartButton"
import VariantViewSmall from "@/components/VariantViewSmall"
import { stringOrObjectID } from "dukon-core-lib/library/common/util"
import ReactMarkdown from "react-markdown"
import { callFunction } from "dukon-core-lib/library/frontend/util/callFunction"

const millisecondsInDay = 1000 * 60 * 60 * 24

const getDateTimeAfter = (days: number) => {
	return new Date(
		new Date().getTime() + millisecondsInDay * days
	).toLocaleString("default", {
		month: "long",
		day: "numeric",
	})
}

function ProductPage({ product }: { product: Product | false }) {
	const auth = useUserState(state => state.auth)
	const addItemToCart = useUserState(state => state.addItemToCart)
	const { cartItems } = useUserState(state => state.user.data)

	if (product === false) {
		return (
			<>
				<div style={{ padding: "5vw" }}>
					<h2>Invalid Product ID</h2>
					<h5>The Product you were looking for does not exist</h5>
					<p style={{ fontSize: 18 }}>
						Get back to the home page <a href="/">Home</a>
					</p>
				</div>
			</>
		)
	}

	const { primaryVariantType, variants, variantsOrder, images } = product

	let currCartItems = cartItems.filter(item => {
		const currProduct = item.product
		return stringOrObjectID(currProduct) === product._id
	})

	const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({})
	const [currImageKey, steImageKey] = useState(images.order[0])

	const setSelectedVariant = (
		variantType: VariantType,
		variantKey: VariantKey
	) => {
		const currVariantsInner = variants[variantType]
		const currVariant = variants[variantType].variantsInner[variantKey]
		if (currVariantsInner.isImaged && currVariant.imageKeys?.length) {
			steImageKey(currVariant.imageKeys[0])
		}
		setSelectedVariants({ ...selectedVariants, [variantType]: variantKey })
	}

	const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("")
	useEffect(
		() =>
			setExpectedDeliveryDate(getDateTimeAfter(product.expectedDeliveryDays)),
		[]
	)

	// todo : alter this
	const onAddToCart = async () => {
		if (!auth) return toast.error("You need to login first")
		for (let variantType of variantsOrder) {
			if (!selectedVariants[variantType])
				return toast.error(`Please select a ${variantType}`)
		}

		const stringifiedVariant = stringifyVariant(selectedVariants, product._id)
		const variantObject = product.variantsList[stringifiedVariant]

		if (!variantObject) return toast.error("Invalid Variants for the product")
		if (!variantObject.inStock)
			return toast.error("The Variant is out of stock")

		await addItemToCart(product._id, selectedVariants)
	}

	return (
		<main className={styles.productPage}>
			{!!product && (
				<>
					<div className={styles.left}>
						<ProductImagesSlider
							product={product}
							moveToImageKey={currImageKey}
						/>
						<div className={styles.imageSelector}></div>
					</div>
					<div className={styles.right}>
						<div className={styles.productNameWrapper}>
							<h1 className={styles.productName}>{product.name}</h1>
						</div>
						<div className={styles.priceWrapper}>
							{/* <div className={styles.priceDiscounted}>₹{product.sp}</div> */}
							{/* {product.sp !== product.mp && (
								<div>
									<s>₹{product.mp}</s>
								</div>
							)} */}
						</div>

						{variantsOrder.map(variantType => (
							<ProductVariantSelectorWrapper
								variantsInnerWrapper={variants[variantType]}
								onVariantKeyUpdate={variantKey => {
									setSelectedVariant(variantType, variantKey)
								}}
								selectedVariantKey={selectedVariants[variantType] || null}
								variantType={variantType}
								productID={product._id}
								key={"variantType-" + variantType}
							/>
						))}

						<div className={styles.addToCartWrapper}>
							<AddToCartButton
								onButtonClicked={onAddToCart}
								productID={product._id}
							/>
						</div>
						{!!currCartItems.length && (
							<div className={styles.colorsWrapper}>
								<div className={styles.colorsHeading}>In Cart</div>
								<small>
									{" "}
									{currCartItems.map((cartItem, index) => (
										<VariantViewSmall
											variantListKey={cartItem.variantListKey}
											quantity={cartItem.quantity}
											product={product}
											key={
												JSON.stringify(cartItem.variantListKey) +
												stringOrObjectID(cartItem.product)
											}
										/>
									))}{" "}
								</small>
							</div>
						)}
						<div className={styles.expectedDelivery}>
							<strong className={styles.expectedDeliveryHeading}>
								Expected Delivery
							</strong>
							<span>
								The order is expected to be deilvered on
								{" " + expectedDeliveryDate}
							</span>
						</div>
						<div className={styles.expectedDelivery}>
							<div>Cash On Deliver(COD) ✅</div>
							<div>7-day easy return and exchange ✅ </div>
							<div>Best Quality ✅ </div>
						</div>
						<div className={styles.expectedDelivery}>
							<div className={"markdown"}>
								<ReactMarkdown>{product.description}</ReactMarkdown>
							</div>
						</div>
					</div>
				</>
			)}
		</main>
	)
}

export async function getStaticProps(context: GetStaticPropsContext) {
	try {
		const { productID: productID } = context.params as { productID: string }
		const apiRes = await callFunction(
			"fetchProductFrontendServer",
			{ productID, frontend_server_key: process.env.FRONTEND_SERVER_KEY || "" },
			false,
			websiteConfig.storeID
		)
		console.log(apiRes)

		const product = (apiRes.data?.product as Product) || false
		return { props: { product: product } }
	} catch (error) {
		console.error(error)
		return { props: { product: false } }
	}
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: "blocking",
	}
}

export default ProductPage
