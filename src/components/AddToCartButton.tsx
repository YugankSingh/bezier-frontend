import styles from "./AddToCartButton.module.scss"
import { useMemo, useState } from "react"
import { images } from "@/images"

interface AddToCartButtonProps {
	onButtonClicked: () => void
	productID: string
}

function AddToCartButton({ onButtonClicked, productID }: AddToCartButtonProps) {
	const [isClicked, setIsClicked] = useState(false)
	const imageIndex = useMemo(() => {
		if (!productID || productID.length === 0) return 1
		const lastChar = productID[productID.length - 1]
		const hexValue = parseInt(lastChar, 16)
		if (Number.isNaN(hexValue)) return 1
		return (hexValue % 2) + 1
	}, [productID])
	return (
		<div className={styles.buttonWrapper} >
			<button
				className={`${styles.button}  ${isClicked ? styles.buttonClicked : ""}`}
				style={
					{
						backgroundImage: "url(" + images[`buttonBg${imageIndex}`] + ")",
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
						backgroundPosition: "center",
					} as React.CSSProperties
				}
				// onClick={() => {
				// 	setIsClicked(true)

				// 	setTimeout(() => {
				// 		setIsClicked(false)
				// 	}, 100)
				// }}

				onMouseDown={() => {
					setIsClicked(true)
				}}
				onMouseUp={() => {
					setIsClicked(false)
					onButtonClicked()
				}}
			>
				Add to Cart
			</button>
		</div>
	)
}

export default AddToCartButton
