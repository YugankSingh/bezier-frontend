import Link from "next/link"
import styles from "./index.module.scss"
import { images } from "@/images"

export default function Home() {
	return (
		<>
			<main className={`${styles.homeWrapper}`}>
				<section
					className={styles.hero}
					style={{ backgroundImage: `url(${images.heroBanner})` }}
				>
					<div className={styles.heroOverlay} />
					<div className={styles.heroContent}>
						<h1>
							MODERN
							<br />
							CLOTHING FOR YOU
						</h1>
						<Link href="/shop" className={styles.button}>
							Shop Now
						</Link>
					</div>
				</section>
			</main>
		</>
	)
}
