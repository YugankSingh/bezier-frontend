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
			</main>
		</>
	)
}
