import React, { FunctionComponent, useEffect } from "react"
import styles from "./Modal.module.scss"

type ModalVariant = "default" | "payment"

interface Props {
	handleClose: () => void
	handleProceed?: () => void
	handleCancel?: () => void
	heading?: string
	text?: string
	CustomElement?: FunctionComponent<any>
	CustomElementProps?: object
	children?: React.ReactNode
	shouldShow: boolean
	proceedButtonText?: string
	cancelButtonText?: string
	hideActions?: boolean
	closeOnBackdropClick?: boolean
	showCloseButton?: boolean
	variant?: ModalVariant
	contentClassName?: string
	backdropClassName?: string
}

function Modal({
	handleClose,
	handleProceed,
	handleCancel,
	heading,
	text = "",
	CustomElement,
	CustomElementProps,
	children,
	shouldShow,
	proceedButtonText = "Proceed",
	cancelButtonText = "Cancel",
	hideActions = false,
	closeOnBackdropClick = true,
	showCloseButton = false,
	variant = "default",
	contentClassName,
	backdropClassName,
}: Props) {
	if (!shouldShow) return null

	useEffect(() => {
		const prevOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") handleClose()
		}
		window.addEventListener("keydown", onKeyDown)
		return () => {
			window.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = prevOverflow
		}
	}, [handleClose])

	const isPaymentVariant = variant === "payment"
	const backdropClasses = [
		styles.backdrop,
		isPaymentVariant ? styles.backdropPayment : "",
		backdropClassName || "",
	]
		.filter(Boolean)
		.join(" ")
	const contentClasses = [
		styles.content,
		isPaymentVariant ? styles.contentPayment : "",
		contentClassName || "",
	]
		.filter(Boolean)
		.join(" ")
	const showActions = !hideActions && (!!handleCancel || !!handleProceed)

	return (
		<div className={styles.modal}>
			<div
				className={backdropClasses}
				onClick={closeOnBackdropClick ? handleClose : undefined}
			></div>
			<div className={contentClasses} role="dialog" aria-modal="true">
				{showCloseButton ? (
					<button
						type="button"
						className={styles.closeButton}
						onClick={handleClose}
						aria-label="Close"
					>
						×
					</button>
				) : null}
				{heading ? <h4>{heading}</h4> : null}
				{text ? <p>{text}</p> : null}
				{children}
				{CustomElement ? <CustomElement {...CustomElementProps} /> : null}
				{showActions ? (
					<div className={styles.buttons}>
						{handleCancel ? (
							<button onClick={handleCancel} className={styles.cancel}>
								{cancelButtonText}
							</button>
						) : null}
						{handleProceed ? (
							<button onClick={handleProceed} className={styles.confirm}>
								{proceedButtonText}
							</button>
						) : null}
					</div>
				) : null}
			</div>
		</div>
	)
}

export default Modal
