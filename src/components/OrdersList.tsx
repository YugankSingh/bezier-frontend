import React, { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import OrderView from "./OrderView"
import styles from "./OrdersList.module.scss"
import { callFunction } from "dukon-core-lib/library/frontend/util/callFunction"
import { Order } from "dukon-core-lib/library/common/types"

function OrdersList() {
	const [orders, setOrders] = useState<Order[] | null>(null)
	const [page, setPage] = useState(1)
	const [hasNextPage, setHasNextPage] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const pageSize = 8

	const fetchPage = async (targetPage: number) => {
		if (targetPage < 1) return
		setIsLoading(true)
		try {
			const offset = (targetPage - 1) * pageSize
			const res = await callFunction("fetchMyOrders", {
				limit: pageSize + 1,
				offset,
			})
			if (!res.success) {
				setIsLoading(false)
				return
			}
			const list: Order[] = res.data?.orders || []
			setHasNextPage(list.length > pageSize)
			setOrders(list.slice(0, pageSize))
			setPage(targetPage)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchPage(1)
	}, [])

	if (!orders) {
		return (
			<div>
				<Skeleton height={350} width={`100%`} />
				<br />
			</div>
		)
	}
	if (!orders.length) return <h3>You have not placed any orders yet.</h3>

	return (
		<div>
			{orders.map(order => (
				<OrderView key={order._id} order={order} />
			))}
			<br />
			<div className={styles.pagination}>
				<div className={styles.pager}>
					<button
						className={styles.navButton}
						onClick={() => fetchPage(page - 1)}
						disabled={page <= 1 || isLoading}
						aria-label="Previous page"
					>
						‹ Prev
					</button>
					<span className={styles.pageNumber}>Page {page}</span>
					<button
						className={styles.navButton}
						onClick={() => fetchPage(page + 1)}
						disabled={!hasNextPage || isLoading}
						aria-label="Next page"
					>
						{isLoading ? "Loading…" : "Next ›"}
					</button>
				</div>
			</div>
		</div>
	)
}

export default OrdersList
