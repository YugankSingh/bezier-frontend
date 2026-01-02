"use client"
import React from "react"
import Link from "next/link"
import styles from "./Navbar.module.scss"
import { FiShoppingCart, FiUser } from "react-icons/fi"

import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import { images } from "@/images"

const logoImage = images.logo
const navLinks = [
	{ label: "Women", href: "/shop?category=women" },
	{ label: "Men", href: "/shop?category=men" },
	{ label: "About", href: "/" },
]

export default function Navbar({}) {
	const auth = useUserState(state => state.auth)
	return (
		<header className={styles.sticky}>
			<nav className={`${styles.nav}`}>
				<div className={styles.navleft}>
					<Link href="/">
						<img src={logoImage} alt="Logo" className={styles.logo} />
					</Link>
				</div>

				<ul className={styles.navLinks}>
					{navLinks.map(link => (
						<li key={link.href}>
							<Link href={link.href}>{link.label}</Link>
						</li>
					))}
				</ul>

				<div className={styles.actions}>
					{auth === false && (
						<Link href="/login" className={styles.authLink}>
							<FiUser className={styles.icon} />
							<span>Sign In</span>
						</Link>
					)}
					{auth === null && <span className={styles.loading}>Loading...</span>}
					{!!auth && (
						<Link href="/account" className={styles.authLink}>
							<FiUser className={styles.icon} />
							<span>{auth.displayName?.split(" ")[0].slice(0, 12)}</span>
						</Link>
					)}
					<Link href="/checkout/cart" className={styles.cartLink}>
						<FiShoppingCart className={styles.icon} />
						<span>Cart</span>
					</Link>
					<Link className={styles.shopButton} href="/shop">
						Shop Now
					</Link>
				</div>
			</nav>
		</header>
	)
}
