import CartItem from "@/components/CartItem"
import CartSum from "@/components/CartSum"
import ProtectedRoutesHOC from "dukon-core-lib/library/frontend/component/ProtectedRoutesHOC"
import { useOrderState } from "dukon-core-lib/library/frontend/states/order"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import styles from "./CartPage.module.scss"
import hocStyles from "@/components/CommonPagesViewHOC.module.scss"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import toast from "react-hot-toast"
import {
	destringifyVariant,
	stringifyVariant,
} from "dukon-core-lib/library/common/util/variants"
import { stringOrObjectID } from "dukon-core-lib/library/common/util"
import { useProductsState } from "dukon-core-lib/library/frontend/states/products"
import Skeleton from "react-loading-skeleton"
import CommonPagesViewHOC from "@/components/CommonPagesViewHOC"

function Cart() {
	const cartItemsDeleting = useRef<string[]>([])
	const cartItems = useUserState(state => state.user.data.cartItems)
	const isLoaded = useUserState(state => state.user.isLoaded)
	const router = useRouter()
	const addItemsToOrder = useOrderState(state => state.addCartItems)
	const resetCurrentOrder = useOrderState(state => state.resetCurrentOrder)

	useEffect(() => {
		resetCurrentOrder()
	})

	const onProceed = () => {
		addItemsToOrder(cartItems)
		router.push("/checkout/address")
	}

	const removeProduct = useProductsState(state => state.removeProduct)

	const fetchProduct = useProductsState(state => state.fetchProduct)
	const deleteCartItem = useUserState(state => state.deleteCartItem)
	const fetchedProducts = useProductsState(state => state.fetchedProducts)
	let areProductsFetched = true

	cartItems.forEach(cartItem => {
		const productObject = fetchedProducts[stringOrObjectID(cartItem.product)]
		if (!productObject || !productObject.isLoaded || !productObject.product) {
			fetchProduct(stringOrObjectID(cartItem.product))
			areProductsFetched = false
		} else {
			const { product } = productObject
			const variantListKey = cartItem.variantListKey
			const variantsObject = product.variantsList[variantListKey]
			if (product.variantsList && !variantsObject) {
				areProductsFetched = false
				const productID = stringOrObjectID(cartItem.product),
					variant = destringifyVariant(variantListKey).variant

				const isPreviouslyPushedForDeletion =
					cartItemsDeleting.current.includes("" + productID + variantListKey)

				if (isPreviouslyPushedForDeletion) return
				toast.error(
					<div>
						It seems like some variant of {product.name} is no longer available
						<br />
						Please select some other variant
						<br />
						<a href={`/shop/product/${productID}`}>{product.name}</a>
					</div>
				)
				cartItemsDeleting.current.push("" + productID + variantListKey)
				deleteCartItem(productID, variantListKey)
			}
		}
	})

	if (!isLoaded) return <Skeleton height={800} width={`100%`} />

	if (!cartItems.length)
		return (
			<h2 className={styles.cartEmpty}>
				Oops the Cart is Empty <Link href="/shop">Shop Now</Link>
			</h2>
		)

	return (
		<div>
			<div className={hocStyles.main}>
				<div className={hocStyles.secondaryDivFirst}>
					<CartSum
						cartItems={cartItems}
						onProceed={onProceed}
						proceedText="Proceed"
						areProductsFetched={areProductsFetched}
					/>
				</div>
				<div className={styles.cartItems}>
					{cartItems.map((item, index) => (
						<CartItem
							cartItem={item}
							key={stringOrObjectID(item.product) + index}
						/>
					))}
				</div>
				<div className={hocStyles.secondaryDivSecond}>
					<CartSum
						cartItems={cartItems}
						onProceed={onProceed}
						proceedText="Proceed"
						areProductsFetched={areProductsFetched}
					/>
				</div>
			</div>
		</div>
	)
}

export default ProtectedRoutesHOC(CommonPagesViewHOC(<Cart />, "Shopping Cart"))
