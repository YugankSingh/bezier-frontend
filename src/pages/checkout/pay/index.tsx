import ProtectedRoutesHOC from "dukon-core-lib/library/frontend/component/ProtectedRoutesHOC"
import React, { useEffect, useRef, useState } from "react"
import Skeleton from "react-loading-skeleton"
import { useOrderState } from "dukon-core-lib/library/frontend/states/order"
import { adminConfig } from "dukon-core-lib/library/admin-frontend/admin.config"
import websiteConfig from "@/website.config"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import CartSum from "@/components/CartSum"
import hocStyles from "@/components/CommonPagesViewHOC.module.scss"
import CommonPagesViewHOC from "@/components/CommonPagesViewHOC"
import styles from "./MakeyPayment.module.scss"
import { images } from "@/images"

function LoadingPayPage() {
	return <Skeleton height={600} width={`100%`} />
}

function PayPage() {
	const payment = useOrderState(state => state.payment)
	const createOrderInServer = useOrderState(state => state.createOrderInServer)

	const router = useRouter()
	const cartItems = useOrderState(state => state.cartItems)
	const address = useOrderState(state => state.address)
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false)
	const backFromPaymentPage = useOrderState(state => state.backFromPaymentPage)
	const orderID = useOrderState(state => state.orderID)

	const onBack = () => {
		backFromPaymentPage()
		router.push("/checkout/address")
	}

	useEffect(() => {
		if (!cartItems || !cartItems.length || !address)
			router.push("/checkout/cart")
	}, [cartItems, router])

	const handleMessageFromPaymentPage = (event: MessageEvent<any>) => {
		if (event.origin !== adminConfig.paymentsPageOrigin) return
		console.log("Message received from iframe:", event.data)
		const message = event.data
		if (typeof message === "string") {
			if (message == "loaded") setIsIframeLoaded(true)
			if (message.startsWith("error:")) toast.error(message.slice(6))
			if (message == "done") {
				if (orderID) {
					let base64OrderID = ""
					try {
						if (/^[0-9a-fA-F]+$/.test(orderID) && orderID.length % 2 === 0) {
							base64OrderID = Buffer.from(orderID, "hex").toString("base64")
						} else {
							// assume already base64 or fallback to base64-encoding the raw string
							const test = Buffer.from(orderID, "base64")
							base64OrderID = test.length
								? orderID
								: Buffer.from(orderID).toString("base64")
						}
					} catch {
						base64OrderID = orderID
					}
					router.push(`/checkout/payment-confirmation/${base64OrderID}`)
				} else {
					router.push("/checkout/payment-confirmation/invalid")
				}
			}
		}
	}

	useEffect(() => {
		window.addEventListener("message", handleMessageFromPaymentPage)
		return () =>
			window.removeEventListener("message", handleMessageFromPaymentPage)
	}, [])

	useEffect(() => {
		if (!isIframeLoaded || !payment) return
		const iframe = iframeRef.current
		if (!iframe || !iframe.contentWindow) {
			toast.error("The payment page was not laoded properly!")
			return
		}

		iframe.contentWindow.postMessage(
			JSON.stringify({
				payment: payment,
				store: {
					logoImage: images.logo,
					name: websiteConfig.name,
					url: websiteConfig.frontendOrigin,
				},
			}),
			adminConfig.paymentsPageOrigin
		)
	}, [payment, isIframeLoaded])

	if (!cartItems || !cartItems.length || !address)
		return <LoadingPayPage />

	if (!payment) {
		createOrderInServer()
		return <LoadingPayPage />
	}
	if(!orderID) {
		return <LoadingPayPage />
	}

	const bgColor = "000000"
	return (
		<div className={`${styles.paymentSection}`}>
			<iframe
				height={"100%"}
				width={"100%"}
				ref={iframeRef}
				style={
					{
						// display: isIframeLoaded ? "block" : "none",
					}
				}
				src={`${adminConfig.paymentsPageOrigin}/checkout/payment/${payment.pg}?storeID=${websiteConfig.storeID}&bgColor=${bgColor}`}
			></iframe>
		</div>
	)
}

export default ProtectedRoutesHOC(CommonPagesViewHOC(<PayPage />, "Pay"))
