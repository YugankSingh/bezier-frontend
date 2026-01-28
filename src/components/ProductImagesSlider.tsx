"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./ProductImagesSlider.module.scss"
import { ImageKey, Product } from "dukon-core-lib/library/common/types"
import DisplayImage from "./DisplayImage"
import websiteConfig from "@/website.config"
import ChevronLeftIcon from "@/icons/ChevronLeftIcon"
import ChevronRightIcon from "@/icons/ChevronRightIcon"

interface ProductImagesSliderProps {
	product: Product
	moveToImageKey?: ImageKey
	inheritedClassName?: string
}

export default function ProductImagesSlider({
	product,
	moveToImageKey,
	inheritedClassName,
}: ProductImagesSliderProps) {
	const viewportRef = useRef<HTMLDivElement | null>(null)
	const slideRefs = useRef<Array<HTMLDivElement | null>>([])
	const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
	const rafRef = useRef<number | null>(null)
	const [activeIndex, setActiveIndex] = useState(0)

	const orderedImages = useMemo(
		() => product.images.order,
		[product.images.order],
	)

	const scrollToIndex = useCallback(
		(index: number, behavior: ScrollBehavior) => {
			const viewport = viewportRef.current
			const slide = slideRefs.current[index]
			if (!viewport || !slide) return
			viewport.scrollTo({ left: slide.offsetLeft, behavior })
		},
		[],
	)

	const computeActiveIndex = useCallback(() => {
		const viewport = viewportRef.current
		if (!viewport) return
		const left = viewport.scrollLeft
		let bestIndex = 0
		let bestDist = Number.POSITIVE_INFINITY
		for (let i = 0; i < slideRefs.current.length; i++) {
			const slide = slideRefs.current[i]
			if (!slide) continue
			const dist = Math.abs(slide.offsetLeft - left)
			if (dist < bestDist) {
				bestDist = dist
				bestIndex = i
			}
		}
		setActiveIndex(bestIndex)
	}, [])

	useEffect(() => {
		if (!moveToImageKey) return
		const targetIndex = orderedImages.indexOf(moveToImageKey)
		if (targetIndex >= 0) scrollToIndex(targetIndex, "smooth")
	}, [moveToImageKey, orderedImages])

	useEffect(() => {
		const viewport = viewportRef.current
		if (!viewport) return
		const onScroll = () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
			rafRef.current = requestAnimationFrame(() => {
				computeActiveIndex()
			})
		}
		viewport.addEventListener("scroll", onScroll, { passive: true })
		computeActiveIndex()
		return () => {
			viewport.removeEventListener("scroll", onScroll)
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
		}
	}, [computeActiveIndex])

	useEffect(() => {
		const viewport = viewportRef.current
		if (!viewport) return
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				e.preventDefault()
				scrollToIndex(Math.max(0, activeIndex - 1), "smooth")
			}
			if (e.key === "ArrowRight") {
				e.preventDefault()
				scrollToIndex(
					Math.min(orderedImages.length - 1, activeIndex + 1),
					"smooth",
				)
			}
		}
		viewport.addEventListener("keydown", onKeyDown)
		return () => viewport.removeEventListener("keydown", onKeyDown)
	}, [activeIndex, orderedImages.length, scrollToIndex])

	return (
		<div className={`${styles.root} ${inheritedClassName || ""}`}>
			<div
				ref={viewportRef}
				className={styles.viewport}
				role="region"
				aria-roledescription="carousel"
				aria-label={`${product.name} images`}
				tabIndex={0}
			>
				{orderedImages.map((imageKey, index) => {
					const imageObject = product.images.list[imageKey]
					return (
						<div
							className={styles.slide}
							key={imageKey}
							aria-label={`${index + 1} of ${orderedImages.length}`}
							ref={node => {
								slideRefs.current[index] = node
								itemRefs.current[imageKey] = node
							}}
						>
							<DisplayImage
								imageKey={imageKey}
								image={imageObject}
								storeID={websiteConfig.storeID}
								mediaType="productImages"
								altText={product.name + " Preview"}
							/>
						</div>
					)
				})}
			</div>

			<button
				type="button"
				className={`${styles.arrow} ${styles.prev}`}
				onClick={() => scrollToIndex(Math.max(0, activeIndex - 1), "smooth")}
				disabled={activeIndex <= 0}
				aria-label="Previous image"
			>
				<ChevronLeftIcon size={22} />
			</button>
			<button
				type="button"
				className={`${styles.arrow} ${styles.next}`}
				onClick={() =>
					scrollToIndex(
						Math.min(orderedImages.length - 1, activeIndex + 1),
						"smooth",
					)
				}
				disabled={activeIndex >= orderedImages.length - 1}
				aria-label="Next image"
			>
				<ChevronRightIcon size={22} />
			</button>

			<div className={styles.dots} role="tablist" aria-label="Choose image">
				{orderedImages.map((imageKey, index) => (
					<button
						key={imageKey}
						type="button"
						className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
						onClick={() => scrollToIndex(index, "smooth")}
						aria-label={`Go to image ${index + 1}`}
						aria-current={index === activeIndex}
					/>
				))}
			</div>
		</div>
	)
}
