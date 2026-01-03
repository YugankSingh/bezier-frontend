import Link from "next/link"
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"
import styles from "./Footer.module.scss"

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.footerBar}>
				<div className={styles.footerLinks}>
					<Link href="/faq">FAQ</Link>
					<Link href="/shipping">Shipping</Link>
					<Link href="/contact">Contact</Link>
				</div>
				<div className={styles.footerSocial}>
					<a
						href="https://facebook.com"
						target="_blank"
						rel="noreferrer"
						aria-label="Facebook"
					>
						<FaFacebookF />
					</a>
					<a
						href="https://twitter.com"
						target="_blank"
						rel="noreferrer"
						aria-label="Twitter"
					>
						<FaTwitter />
					</a>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noreferrer"
						aria-label="Instagram"
					>
						<FaInstagram />
					</a>
					<a
						href="https://youtube.com"
						target="_blank"
						rel="noreferrer"
						aria-label="YouTube"
					>
						<FaYoutube />
					</a>
				</div>
			</div>
		</footer>
	)
}
