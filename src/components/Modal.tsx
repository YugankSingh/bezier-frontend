import React, { ComponentType, FunctionComponent } from "react"
import styles from "./Modal.module.scss"

interface Props {
	handleClose: () => void
	handleProceed: () => void
	handleCancel: () => void
	heading: string
	text: string
	CustomElement?: FunctionComponent<any>
	CustomElementProps?: object
	shouldShow: boolean
	proceedButtonText?: string
	cancelButtonText?: string
}

function Modal({
	handleClose,
	handleProceed,
	handleCancel,
	heading,
	text,
	CustomElement,
	CustomElementProps,
	shouldShow,
	proceedButtonText = "Proceed",
	cancelButtonText = "Cancel",
}: Props) {
	if (!shouldShow) return null
	return (
		<div className={styles.modal}>
			<div className={styles.backdrop} onClick={handleClose}></div>
			<div className={styles.content}>
				{heading && <h4>{heading}</h4>}
				<p>{text}</p>
				{CustomElement && <CustomElement {...CustomElementProps} />}
				<div className={styles.buttons}>
					<button onClick={handleCancel} className={styles.cancel}>
						{cancelButtonText}
					</button>
					<button onClick={handleProceed} className={styles.confirm}>
						{proceedButtonText}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Modal
