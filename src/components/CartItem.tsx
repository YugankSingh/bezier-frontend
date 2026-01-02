import { CartItem } from "dukon-core-lib/library/common/types"
import { stringOrObjectID } from "dukon-core-lib/library/common/util"
import styles from "./CartItem.module.scss"
import { useProductsState } from "dukon-core-lib/library/frontend/states/products"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import Link from "next/link"
import React from "react"
import Skeleton from "react-loading-skeleton"
import ProductImagesSlider from "./ProductImagesSlider"
import VariantViewSmall from "./VariantViewSmall"
import DisplayImage from "./DisplayImage"

export type CartItemProps = {
	cartItem: CartItem
}

function CartItemView({ cartItem }: CartItemProps) {
	const [increaseCartItemQuantity, decreaseCartItemQuantity, deleteCartItem] =
		useUserState(state => [
			state.increaseCartItemQuantity,
			state.decreaseCartItemQuantity,
			state.deleteCartItem,
		])

	const productID = stringOrObjectID(cartItem.product)

	const fetchedProducts = useProductsState(state => state.fetchedProducts)
	const productObject = fetchedProducts[productID] || false

	const loadingSkeleton = (
		<div>
			<Skeleton height={120} width={`80%`} />
			<Skeleton height={14} width={`60%`} />
			<Skeleton height={20} width={`40%`} />
		</div>
	)

	if (!productObject || !productObject.isLoaded || !productObject.product)
		return loadingSkeleton
	const product = productObject.product
	const variantsObject = product.variantsList[cartItem.variantListKey]
	if (!variantsObject) return loadingSkeleton

	const imageKey = product.images.order[0]
	const imageObject = product.images.list[imageKey]

	return (
		<div className={styles.cartItem}>
			<div className={styles.variantImageWrapper}>
				<Link href={`/shop/product/${stringOrObjectID(product)}`}>
					<DisplayImage
						imageKey={imageKey}
						image={imageObject}
						mediaType={"productImages"}
					/>
				</Link>
			</div>
			<div className={styles.itemDetails}>
				<Link href={`/shop/product/${stringOrObjectID(product)}`}>
					<h2>{product.name}</h2>
				</Link>
				<h6>
					₹{variantsObject.sp}{" "}
					{!!variantsObject.mp && variantsObject.mp != variantsObject.sp && (
						<small>
							<s>₹{variantsObject.mp}</s>
						</small>
					)}
				</h6>
				<VariantViewSmall
					quantity={cartItem.quantity}
					variantListKey={cartItem.variantListKey}
					product={product}
					showQuantity={false}
				/>

				{/* {variant.map(({ variantType, name }, index) => (
					<div className={styles.variants} key={index}>
						{getVariantTypeName(variantType) + " : " + name}
					</div>
				))} */}
				<div className={styles.quantity}>Quantity : {cartItem.quantity}</div>
				<div className={styles.actions}>
					<button
						onClick={() =>
							increaseCartItemQuantity(
								stringOrObjectID(product),
								cartItem.variantListKey
							)
						}
					>
						<span className="material-icons" >
							add
						</span>
					</button>
					<button
						onClick={() =>
							cartItem.quantity > 1 &&
							decreaseCartItemQuantity(
								stringOrObjectID(product),
								cartItem.variantListKey
							)
						}
					>
						<span className="material-icons">remove</span>
					</button>
					<button
						onClick={() =>
							deleteCartItem(stringOrObjectID(product), cartItem.variantListKey)
						}
					>
						<span className="material-icons">delete</span>

						{/* 🗑️ */}
					</button>
				</div>
			</div>
		</div>
	)
}

export default CartItemView
