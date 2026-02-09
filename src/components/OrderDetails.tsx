import React, { useMemo } from "react"
import styles from "./OrderDetails.module.scss"
import DisplayImage from "./DisplayImage"
import Link from "next/link"
import { Order, OrderItem, Product } from "dukon-core-lib/library/common/types"
import { orderStatusMap } from "dukon-core-lib/library/admin-frontend/util/orderStatusMaps"
import { mongoIdToBase64Url } from "dukon-core-lib/library/common/util"
import {
	destringifyVariant,
	getVariantMapList,
} from "dukon-core-lib/library/common/util/variants"

function formatCurrency(amount?: number) {
	if (typeof amount !== "number") return "Rs. —"
	return `Rs.${amount}`
}

function getOrderItemPriceSP(orderItem: OrderItem) {
	const pv = orderItem.productVersioned
	if (typeof pv === "string") return undefined
	const product = pv.product as Product
	const variantKey = orderItem.variantListKey
	const listObject = product.variantsList?.[variantKey]
	if (!listObject) return undefined
	return listObject.sp
}

function ProductRow({ item }: { item: OrderItem }) {
	const pv = item.productVersioned
	if (typeof pv === "string" || !pv?.product)
		return <div className={styles.product}>Invalid product</div>
	const product = pv.product as Product

	const imageKey = product.images.order?.[0]
	const imageObject = imageKey ? product.images.list?.[imageKey] : undefined

	const unitPrice = getOrderItemPriceSP(item)
	const subtotal =
		typeof unitPrice === "number" ? unitPrice * (item.quantity || 0) : undefined

	let variantChips: { type: string; text: string; key: string }[] = []
	try {
		const { variant } = destringifyVariant(item.variantListKey)
		const vmList = getVariantMapList(
			variant,
			product.variants,
			product.variantsOrder,
		)

		console.log("variant in order details ", variant)

		variantChips = vmList.map(vm => ({
			type: vm.variantType,
			text: vm.variant?.text || vm.variantKey,
			key: vm.variantKey,
		}))
	} catch (e) {
		// ignore variant parse/display errors
		console.error("error in order details ", e)
	}

	return (
		<div className={styles.product}>
			<div className={styles.product__image}>
				<Link href={`/shop/product/${product._id}`}>
					<DisplayImage
						imageKey={imageKey}
						image={imageObject}
						mediaType={"productImages"}
					/>
				</Link>
			</div>
			<div className={styles.product__info}>
				<p className={styles.product__info__name}>{product.name}</p>
				<p className={styles.product__info__meta}>
					Unit: {formatCurrency(unitPrice)}
				</p>
				{variantChips.length ? (
					<div className={styles.product__variants}>
						{variantChips.map(vm => (
							<span key={vm.type} className={styles.variantChip}>
								<span className={styles.variantChip__type}>{vm.type}</span>
								<span className={styles.variantChip__value}>{vm.text}</span>
							</span>
						))}
					</div>
				) : null}
			</div>
			<div className={styles.product__qty}>x {item.quantity}</div>
			<div className={styles.product__subtotal}>{formatCurrency(subtotal)}</div>
		</div>
	)
}

export default function OrderDetails({ order }: { order: Order }) {
	const orderIDBase64 = useMemo(
		() => mongoIdToBase64Url(order._id),
		[order._id],
	)
	const createdAt = order.createdAt
		? new Date(order.createdAt).toDateString()
		: "—"
	const statusMeta = orderStatusMap[order.orderStatus] || {
		text: "Unknown",
		color: "var(--primary-text-color)",
	}

	const itemsSubtotal = useMemo(() => {
		return order.orderItems.reduce((acc, item) => {
			const sp = getOrderItemPriceSP(item)
			if (typeof sp !== "number") return acc
			return acc + sp * (item.quantity || 0)
		}, 0)
	}, [order.orderItems])

	const shippingCost = order.delivery?.cost || 0
	const totalAmount = order.payment?.amount ?? itemsSubtotal + shippingCost

	return (
		<div className={`hoverDivision ${styles.orderDetails}`}>
			<Link href="/account">Back to orders</Link>

			<div className={styles.header}>
				<div className={styles.header__meta}>
					Order ID: {orderIDBase64} • Placed on {createdAt}
				</div>
				<div
					className={styles.header__status}
					style={{ color: statusMeta.color }}
				>
					{statusMeta.text}
				</div>
			</div>

			<div className={styles.grid}>
				<div className="left">
					<div className={styles.section}>
						<h4 className={styles.sectionTitle}>Products</h4>
						<div className={styles.productsList}>
							{(order.orderItems || []).map(oi => (
								<ProductRow
									key={(oi as any)._id || oi.variantListKey}
									item={oi}
								/>
							))}
						</div>
					</div>

					<div className={styles.section} style={{ marginTop: 16 }}>
						<h4 className={styles.sectionTitle}>Shipping Address</h4>
						{order.address ? (
							<div className={styles.address}>
								<div className={styles.address__name}>{order.address.name}</div>
								<div className={styles.address__line}>
									{order.address.contactNumber}
								</div>
								<div className={styles.address__line}>
									{order.address.line1}
									{order.address.line2 ? `, ${order.address.line2}` : ""}
								</div>
								<div className={styles.address__line}>
									{order.address.city}, {order.address.state} -{" "}
									{order.address.pincode}
								</div>
								<div className={styles.address__line}>
									{order.address.country}
								</div>
							</div>
						) : (
							<div className={styles.address}>—</div>
						)}
					</div>

					<div className={styles.section} style={{ marginTop: 16 }}>
						<h4 className={styles.sectionTitle}>Shipment</h4>
						<div className={styles.delivery}>
							<div className={styles.delivery__row}>
								<span>Status</span>
								<span>
									{order.delivery?.deliveryStatus || "Not yet dispatched"}
								</span>
							</div>
							<div className={styles.delivery__row}>
								<span>Carrier</span>
								<span>{order.delivery?.manager || "—"}</span>
							</div>
							<div className={styles.delivery__row}>
								<span>Type</span>
								<span>{order.delivery?.type || "—"}</span>
							</div>
							<div className={styles.delivery__row}>
								<span>Expected Delivery</span>
								<span>
									{order.delivery?.expectedDeliveryDate
										? new Date(
												order.delivery.expectedDeliveryDate,
											).toDateString()
										: "—"}
								</span>
							</div>
							{order.delivery?.deliveredAt ? (
								<div className={styles.delivery__row}>
									<span>Delivered On</span>
									<span>
										{new Date(order.delivery.deliveredAt).toDateString()}
									</span>
								</div>
							) : null}
						</div>
					</div>
				</div>

				<div className={styles.summary}>
					<div className={styles.summary__card}>
						<h4 className={styles.sectionTitle}>Payment Summary</h4>
						<div
							className={`${styles.summary__row} ${styles["summary__row--muted"]}`}
						>
							<span>Items Subtotal</span>
							<span>{formatCurrency(itemsSubtotal)}</span>
						</div>
						<div
							className={`${styles.summary__row} ${styles["summary__row--muted"]}`}
						>
							<span>Shipping</span>
							<span>{formatCurrency(shippingCost)}</span>
						</div>
						<div
							className={`${styles.summary__row} ${styles["summary__row--total"]}`}
						>
							<span>Total</span>
							<span>{formatCurrency(totalAmount)}</span>
						</div>
					</div>

					<div className={styles.summary__card}>
						<h4 className={styles.sectionTitle}>Payment Details</h4>
						<div
							className={`${styles.summary__row} ${styles["summary__row--muted"]}`}
						>
							<span>Status</span>
							<span>{order.payment?.status || "—"}</span>
						</div>
						{(order.payment as any)?.isPaymentCaptured ? (
							<div
								className={`${styles.summary__row} ${styles["summary__row--muted"]}`}
							>
								<span>Paid On</span>
								<span>
									{(order.payment as any)?.paidOn
										? new Date((order.payment as any).paidOn).toDateString()
										: "—"}
								</span>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	)
}
