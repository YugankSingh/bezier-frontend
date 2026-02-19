import CommonPagesViewHOC from "@/components/CommonPagesViewHOC"
import styles from "./legalPages.module.scss"

function ShippingPage() {
	return (
		<div className={styles.page}>
			<h2 className={styles.pageHeading}>Shipping</h2>
			<div className={styles.lead}>
				This shipping policy explains processing timelines, delivery
				expectations, and support for shipment-related issues.
			</div>

			<section className={styles.section}>
				<h5>Order Processing</h5>
				<p>
					Orders are usually processed within 1 to 3 business days after
					successful payment verification, unless otherwise stated on the
					product page.
				</p>
			</section>

			<section className={styles.section}>
				<h5>Delivery Timelines</h5>
				<p>
					Estimated delivery timelines vary by location and courier
					serviceability. Any delivery date shown at checkout is an estimate and
					not a guaranteed timeline.
				</p>
			</section>

			<section className={styles.section}>
				<h5>Shipping Charges</h5>
				<p>
					Shipping charges, if applicable, are displayed at checkout before
					payment confirmation.
				</p>
			</section>

			<section className={styles.section}>
				<h5>Delays and Force Majeure</h5>
				<p>
					Delivery may be delayed due to weather, strikes, natural events,
					regulatory restrictions, logistics disruptions, or other circumstances
					outside our control.
				</p>
			</section>

			<section className={styles.section}>
				<h5>Failed Delivery Attempts</h5>
				<p>
					If a shipment is returned due to incorrect address, unreachable
					customer, or repeated failed delivery attempts, re-shipping may
					require additional charges.
				</p>
			</section>

			<section className={styles.section}>
				<h5>Damaged or Tampered Packages</h5>
				<p>
					If the package appears tampered or damaged at delivery, you should
					refuse acceptance when possible and contact us immediately with photos
					and order details.
				</p>
			</section>

			<section className={styles.section}>
				<h5>Support Contact</h5>
				<div className={styles.contactBlock}>
					<p>
						<strong>Email:</strong> bezier.wear@gmail.com
					</p>
					<p>
						<strong>Phone:</strong> 9654515329, 7060244633
					</p>
				</div>
			</section>
		</div>
	)
}

export default CommonPagesViewHOC(<ShippingPage />, "")
