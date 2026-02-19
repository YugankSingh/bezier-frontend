import CommonPagesViewHOC from "@/components/CommonPagesViewHOC"
import styles from "./legalPages.module.scss"

function FAQPage() {
	return (
		<div className={styles.page}>
			<h2 className={styles.pageHeading}>FAQ</h2>
			<div className={styles.lead}>
				Clear answers on orders, delivery, and support to help you shop with
				confidence.
			</div>

			<section className={styles.section}>
				<h5>1) How can I place an order?</h5>
				<p>
					Browse products, add items to cart, proceed to checkout, and complete
					the payment. You will receive an order confirmation after successful
					placement.
				</p>
			</section>

			<section className={styles.section}>
				<h5>2) Are all products always in stock?</h5>
				<p>
					Product availability can change without prior notice. In case an item is
					unavailable after order placement, our team will contact you for the next
					steps.
				</p>
			</section>

			<section className={styles.section}>
				<h5>3) How long does delivery take?</h5>
				<p>
					Delivery timelines depend on serviceability, courier operations, weather,
					and other factors outside our control. Timelines shown at checkout are
					estimates and not guaranteed delivery commitments.
				</p>
			</section>

			<section className={styles.section}>
				<h5>4) Can I cancel my order?</h5>
				<p>
					Cancellation requests are considered only if the order has not already
					been processed or shipped. Once shipped, cancellation is generally not
					possible.
				</p>
			</section>

			<section className={styles.section}>
				<h5>5) What if I receive a damaged or wrong item?</h5>
				<p>
					Please contact us within 48 hours of delivery with your order details,
					clear photos, and an unboxing video (if available). Valid cases are
					reviewed and resolved as per applicable policy and law.
				</p>
			</section>

			<section className={styles.section}>
				<h5>6) How can I contact support?</h5>
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
				<h5>7) Do prices include taxes?</h5>
				<p>
					All prices shown on the website are in INR. Applicable taxes, shipping
					charges, and final payable amount are displayed at checkout.
				</p>
			</section>

			<section className={styles.section}>
				<h5>8) Policy updates</h5>
				<p>
					We may update policies from time to time to remain accurate and
					compliant. The latest version published on this website will apply.
				</p>
			</section>
		</div>
	)
}

export default CommonPagesViewHOC(<FAQPage />, "")