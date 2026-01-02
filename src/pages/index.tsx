import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./index.module.scss"
import { images } from "@/images"
import getWebsiteConfig from "dukon-core-lib/library/frontend/websiteConfig"

export default function Home() {
	const backgroundColors = [
		"#7d3f00",
		"#0e6f68",
		"#2c1364",
		"#8b0000",
		"#0e7a0e",
		"#2b2a2b",
	]
	const [backgroundColor, setBackgroundColor] = useState("black")
	useEffect(() => {
		setBackgroundColor(
			backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
		)
	}, [])

	return (
		<>
			<main className={`${styles.homeWrapper}`}>
				<section className={`${styles.hero}`}>
					<div className={`${styles.heroContent}`}>
						<h1>
							We Don't Just Sell
							<br />
							<strong>We Offend.</strong>
						</h1>
						<h6>
							If you are someone who doesn’t give a fuck about the society and
							just want some offensive fun in life, than this is the right place
							to shop.
						</h6>{" "}
						<Link
							href="/shop"
							className={styles.button}
							style={{ backgroundColor: backgroundColor }}
						>
							Shop
						</Link>
					</div>
					<div className={`${styles.heroImages}`}>
						<img src={images.mockup1} alt="" />
						<img src={images.mockup2} alt="" />
						<img src={images.mockup3} alt="" />
						<img src={images.mockup4} alt="" />
					</div>
				</section>
				<section className={styles.offendingSection}>
					<h1>Proudly Offending</h1>
					<div id="#inner">
						<div>
							<p>Faat</p>
							<img src={images.fatguyOffended} alt="Fat Guy Yelling" />
						</div>
						<div>
							<p>Gaay</p>
							<img src={images.gayOffended} alt="Gay Person" />
						</div>
						<div>
							<p>Faminist</p>
							<img src={images.feministOffended} alt="Feminist Angry" />
						</div>
						<div>
							<p>Everyone</p>
							<img src={images.groupOffended} alt="Group of people Spooky" />
						</div>
					</div>
				</section>
				<section className={styles.notPussy}>
					<h2>Now show us that you are not a pussy</h2>
					<Link
						href="/shop"
						className={styles.button}
						style={{ backgroundColor: backgroundColor }}
					>
						Shop Now
					</Link>
				</section>
			</main>
		</>
	)
}
