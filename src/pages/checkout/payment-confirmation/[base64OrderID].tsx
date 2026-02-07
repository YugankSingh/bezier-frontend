import CommonPagesViewHOC from "@/components/CommonPagesViewHOC"
import ProtectedRoutesHOC from "dukon-core-lib/library/frontend/component/ProtectedRoutesHOC"
import { useOrderState } from "dukon-core-lib/library/frontend/states/order"
import { callFunction } from "dukon-core-lib/library/frontend/util/callFunction"
import React, { useEffect, useMemo, useState } from "react"
import Skeleton from "react-loading-skeleton"
import Link from "next/link"
import { useRouter } from "next/router"
import { tryBase64ToMongoId } from "dukon-core-lib/library/common/util"

function PaymentConfirmationPage() {
	const router = useRouter()
	const { base64OrderID } = router.query

	const [message, setMessage] = useState("")
	const [status, setStatus] = useState<null | string>(null)
	const [success, setSuccess] = useState<null | boolean>(null)
	const [secondsLeft, setSecondsLeft] = useState<number>(10)

	const resetCurrentOrder = useOrderState(state => state.resetCurrentOrder)

	const { isValid, hexOrderID } = useMemo(() => {
		if (typeof base64OrderID !== "string")
			return { isValid: false, hexOrderID: "" }
		const hex = tryBase64ToMongoId(base64OrderID)
		return { isValid: !!hex, hexOrderID: hex || "" }
	}, [base64OrderID])

	useEffect(() => {
		// Wipe local order data immediately on confirmation page
		resetCurrentOrder()
	}, [resetCurrentOrder])

	useEffect(() => {
		let mounted = true
		if (!isValid || !hexOrderID) return
		;(async () => {
			const res = await callFunction("confirmOrderPayment", {
				orderID: hexOrderID,
			})
			if (!mounted) return
			setMessage(res?.message || "")
			setStatus(res?.data?.status || null)
			setSuccess(!!res?.success)
		})()
		return () => {
			mounted = false
		}
	}, [isValid, hexOrderID])

	useEffect(() => {
		if (success !== true) return
		if (typeof base64OrderID !== "string") return

		setSecondsLeft(10)
		const redirectTimeout = window.setTimeout(() => {
			router.push(`/account/order/${base64OrderID}`)
		}, 10_000)
		const ticker = window.setInterval(() => {
			setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0))
		}, 1_000)
		return () => {
			window.clearTimeout(redirectTimeout)
			window.clearInterval(ticker)
		}
	}, [success, base64OrderID, router])

	if (typeof base64OrderID !== "string") return <div>Invalid order ID</div>
	if (base64OrderID === "invalid")
		return (
			<div>
				<h4>Invalid order ID</h4>
				<p>The order ID you provided is invalid. Please try again.</p>
			</div>
		)

	if (!isValid) return <div>Invalid order ID</div>

	if (!message && success === null)
		return <Skeleton height={400} width={`100%`} />

	return (
		<div
			style={{
				maxWidth: 680,
				margin: "40px auto",
				textAlign: "center",
				padding: "24px",
			}}
		>
			<div style={{ marginBottom: 12, color: "#666" }}>
				Order ID: {base64OrderID}
			</div>
			{success === true ? (
				<div>
					<h2 style={{ marginBottom: 8 }}>Payment successful</h2>
					<p style={{ marginBottom: 16 }}>
						{message || "Your payment has been confirmed."}
					</p>
					<p style={{ color: "#666", marginBottom: 20 }}>
						Redirecting to your order details in {secondsLeft}s…
					</p>
					{hexOrderID ? (
						<Link
							href={`/account/order/${base64OrderID}`}
							style={{ textDecoration: "underline" }}
						>
							View order now
						</Link>
					) : (
						<Link href="/account" style={{ textDecoration: "underline" }}>
							Go to your account
						</Link>
					)}
				</div>
			) : (
				<div>
					<h2 style={{ marginBottom: 8 }}>Payment failed</h2>
					<p style={{ marginBottom: 16 }}>
						{message || "We couldn't confirm your payment. Please try again."}
					</p>
					<div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
						<Link href="/checkout/pay" style={{ textDecoration: "underline" }}>
							Try again
						</Link>
						<Link href="/checkout/cart" style={{ textDecoration: "underline" }}>
							Review cart
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

export default ProtectedRoutesHOC(
	CommonPagesViewHOC(<PaymentConfirmationPage />, "Payment Confirmation"),
)
