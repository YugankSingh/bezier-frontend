"use client"
import CommonPagesViewHOC from "@/components/CommonPagesViewHOC"
import OrderDetails from "@/components/OrderDetails"
import ProtectedRoutesHOC from "dukon-core-lib/library/frontend/component/ProtectedRoutesHOC"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import { callFunction } from "dukon-core-lib/library/frontend/util/callFunction"
import type { Order } from "dukon-core-lib/library/common/types"
import Skeleton from "react-loading-skeleton"
import hocStyles from "@/components/CommonPagesViewHOC.module.scss"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { tryBase64ToMongoId } from "dukon-core-lib/library/common/util"

function Order() {
	const userAuth = useUserState(state => state.auth)
	const user = useUserState(state => state.user)
	const [order, setOrder] = useState<Order | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	if (!user || !userAuth) return <Skeleton height={600} width={`100%`} />

	const router = useRouter()
	const { orderID } = router.query // Access the dynamic route parameter

	if (typeof orderID !== "string")
		return (
			<div>
				{orderID}
				<p className="error">Invalid order ID</p>
			</div>
		)

	const hexOrderID = tryBase64ToMongoId(orderID)

	if (!hexOrderID)
		return (
			<div>
				<p className="error">Invalid order ID</p>
				<Link href="/account">Back to orders</Link>
			</div>
		)

	useEffect(() => {
		let mounted = true
		;(async () => {
			setIsLoading(true)
			setError(null)
			setOrder(null)
			const res = await callFunction("fetchOrderDetails", {
				orderID: hexOrderID,
			})
			if (!mounted) return
			if (!res?.success || !res?.data?.order) {
				setError(res?.message || "Unable to fetch order details.")
				setIsLoading(false)
				return
			}
			setOrder(res.data.order as Order)
			setIsLoading(false)
		})()
		return () => {
			mounted = false
		}
	}, [hexOrderID])

	return (
		<div>
			<div className={hocStyles.main}>
				{isLoading ? (
					<Skeleton height={480} width={`100%`} />
				) : order ? (
					<>
						<OrderDetails order={order} />
					</>
				) : (
					<div className="hoverDivision">
						<div className="information" style={{ padding: "0 20px" }}>
							<h3>{error ? "Error" : "Order not found"}</h3>
							<p>
								{error ||
									"We couldn&apos;t find an order with the provided ID."}
							</p>
							<Link href="/account">Back to orders</Link>
						</div>
					</div>
				)}
				<div className={hocStyles.secondaryDivSecond}></div>
			</div>
		</div>
	)
}

export default ProtectedRoutesHOC(
	CommonPagesViewHOC(<Order />, "Order Details"),
)
