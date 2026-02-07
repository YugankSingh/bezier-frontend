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
import type { CashfreePaymentPageInitMessage } from "dukon-core-lib/library/common/types"
import Modal from "@/components/Modal"
import { mongoIdToBase64 } from "dukon-core-lib/library/common/util"

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
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(true)
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

	useEffect(() => {
		if (payment && orderID) setIsPaymentModalOpen(true)
	}, [payment, orderID])

	useEffect(() => {
		if (isPaymentModalOpen) setIsIframeLoaded(false)
	}, [isPaymentModalOpen])

	const handleMessageFromPaymentPage = (event: MessageEvent<any>) => {
		if (event.origin !== adminConfig.paymentsPageOrigin) return
		console.log("Message received from iframe:", event.data)
		const message = event.data
		if (typeof message === "string") {
			if (message == "loaded") setIsIframeLoaded(true)
			if (message.startsWith("error:")) toast.error(message.slice(6))
			if (message == "done") {
				const orderID = useOrderState.getState().orderID
				if (orderID) {
					const base64OrderID = mongoIdToBase64(orderID)
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
			} satisfies CashfreePaymentPageInitMessage),
			adminConfig.paymentsPageOrigin,
		)
	}, [payment, isIframeLoaded])

	if (!cartItems || !cartItems.length || !address) return <LoadingPayPage />

	if (!payment) {
		createOrderInServer()
		return <LoadingPayPage />
	}
	if (!orderID) {
		return <LoadingPayPage />
	}

	const bgColor = "000000"
	return (
		<div className={styles.page}>
			<div className={styles.actions}>
				<button type="button" className="button2" onClick={onBack}>
					Back
				</button>
				<button
					type="button"
					className="button important"
					onClick={() => setIsPaymentModalOpen(true)}
				>
					Open payment
				</button>
			</div>

			<Modal
				shouldShow={isPaymentModalOpen}
				handleClose={() => setIsPaymentModalOpen(false)}
				variant="payment"
				closeOnBackdropClick={false}
				hideActions={true}
			>
				<div className={styles.modalInner}>
					<div className={styles.paymentFrameWrap}>
						{!isIframeLoaded ? (
							<div className={styles.loadingOverlay}>
								<Skeleton height={420} width={`100%`} />
							</div>
						) : null}
						<iframe
							title="Payment"
							ref={iframeRef}
							className={styles.paymentFrame}
							src={`${adminConfig.paymentsPageOrigin}/checkout/payment/${payment.pg}?storeID=${websiteConfig.storeID}&bgColor=${bgColor}`}
						></iframe>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default ProtectedRoutesHOC(CommonPagesViewHOC(<PayPage />, "Pay"))
