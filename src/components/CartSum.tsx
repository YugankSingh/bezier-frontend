import { CartItem } from "dukon-core-lib/library/common/types"
import { stringOrObjectID } from "dukon-core-lib/library/common/util"
import { useProductsState } from "dukon-core-lib/library/frontend/states/products"
import React from "react"
import styles from "./CartSum.module.scss"
import Skeleton from "react-loading-skeleton"

export type CartSumProps = {
	cartItems: CartItem[]
	proceedText?: string
	onProceed: () => void
	areProductsFetched: boolean
	shouldShowProceedButton?: boolean
}

function CartSum({
	cartItems,
	proceedText = "Proceed",
	onProceed,
	areProductsFetched,
	shouldShowProceedButton = true,
}: CartSumProps) {
	const fetchedProducts = useProductsState(state => state.fetchedProducts)

	let total = 0
	let quantity = 0

	const loadingSkeleton = (
		<div>
			<Skeleton height={180} width={`100%`} />
		</div>
	)

	if (!areProductsFetched) return loadingSkeleton
	cartItems.forEach(cartItem => {
		const product = fetchedProducts[stringOrObjectID(cartItem.product)]?.product
		if (!product) return loadingSkeleton

		const variantObject = product.variantsList[cartItem.variantListKey]
		total += variantObject.sp * cartItem.quantity
		quantity += cartItem.quantity
	})

	return (
		<div className={styles.cartSum}>
			<div className={styles.cartWrapper}>
				<div className={styles.heading}>
					Subtotal {"(" + quantity + " items)"}
				</div>
				<div className={styles.subtotal}>₹ {total}</div>
				{shouldShowProceedButton && (
					<button onClick={onProceed} className={`${styles.proceedButton} button`}>
						{proceedText}
					</button>
				)}
			</div>
		</div>
	)
}

export default CartSum
