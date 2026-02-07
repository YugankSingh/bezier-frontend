import React from "react"
import DisplayImage from "./DisplayImage" // Ensure the correct import path for DisplayImage
import styles from "./OrderView.module.scss"
import { Order, OrderItem } from "dukon-core-lib/library/common/types"
import { mongoIdToBase64, stringOrObjectID } from "dukon-core-lib/library/common/util"
import Link from "next/link"
import { orderStatusMap } from "dukon-core-lib/library/admin-frontend/util/orderStatusMaps"

function OrderItemView({ orderItem }: { orderItem: OrderItem }) {
	const { productVersioned, quantity } = orderItem
	if (typeof productVersioned === "string" || !productVersioned.product)
		return <p className="error">Invalid data from server</p>
	const product = productVersioned.product
	const imageKey = product.images.order[0]
	const imageObject = product.images.list[imageKey]

	return (
		<div className={styles.orderItem}>
			<Link
				href={`/shop/product/${product._id}`}
				className={styles.orderItem__image}
			>
				<DisplayImage
					imageKey={imageKey}
					image={imageObject}
					mediaType={"productImages"}
				/>
			</Link>
			<div className={styles.orderItem__details}>
				<strong>x </strong> {quantity}
			</div>
		</div>
	)
}

function OrderView({ order }: { order: Order }) {
	const orderDate = new Date(order.createdAt).toDateString()
	const orderID = mongoIdToBase64(order._id)

	return (
		<>
			<div className={`hoverDivision ${styles.orderView}`}>
				<Link
					href={`/account/order/${orderID}`}
					className={styles.orderWrapperLink}
				>
					<p className={styles.orderAmount}>Rs.{order.payment.amount}</p>
					<p
						className={`${styles.orderStatus}`}
						style={{ color: orderStatusMap[order.orderStatus]?.color }}
					>
						{orderStatusMap[order.orderStatus]?.text || "Invalid Order Status"}
					</p>
					<p className={styles.orderCreationDate}>Placed On - {orderDate}</p>
					<div className={styles.orderView__items}>
						{order.orderItems.map(orderItem => (
							<OrderItemView
								key={stringOrObjectID(orderItem.productVersioned)}
								orderItem={orderItem}
							/>
						))}
					</div>
				</Link>
			</div>
		</>
	)
}

export default OrderView
