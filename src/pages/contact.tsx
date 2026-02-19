import CommonPagesViewHOC from "@/components/CommonPagesViewHOC"
import styles from "./legalPages.module.scss"

function ContactPage() {
	return (
		<div className={styles.page}>
			<h2 className={styles.pageHeading}>Contact Details</h2>
			<div className={styles.lead}>
				For order support, shipping help, and general queries, connect with us
				using the details below.
			</div>

			<section className={styles.section}>
				<h5>Contact Channels</h5>
				<div className={styles.contactBlock}>
					<p>
						<strong>Email:</strong> bezier.wear@gmail.com
					</p>
					<p>
						<strong>Phone:</strong> 9654515329, 7060244633
					</p>
				</div>
			</section>

			<section className={styles.section}>
				<h5>Support Hours</h5>
				<p>
					Support response time may vary on weekends, public holidays, and during
					high order volume periods.
				</p>
			</section>

			<section className={styles.section}>
				<h5>Important Note</h5>
				<p>
					For faster resolution, please share your order ID and registered contact
					details when reaching out.
				</p>
			</section>
		</div>
	)
}

export default CommonPagesViewHOC(<ContactPage />, "")