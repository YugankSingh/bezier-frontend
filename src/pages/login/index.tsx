import styles from "./Login.module.scss"
import {
	auth as firebaseAuth,
	provider,
} from "dukon-core-lib/library/frontend/firebase"
import { signInWithPopup } from "firebase/auth"
import loader from "dukon-core-lib/library/frontend/util/toaster"
import { FormEventHandler, useEffect, useState } from "react"
// import GoogleIcon from "@/Icons/GoogleIcon"
import { useRouter } from "next/router"
import ProtectedRoutesHOC from "dukon-core-lib/library/frontend/component/ProtectedRoutesHOC"
import { sendSignInLink } from "dukon-core-lib/library/frontend/util/sendSignInLink"
import GoogleIcon from "@/icons/GoogleIcon"
import isEmailValid from "dukon-core-lib/library/frontend/util/checkEmail"
import websiteConfig from "@/website.config"

function Login({}) {
	const router = useRouter()
	const { query } = router
	const [email, setEmail] = useState((query.email as string) || "")

	useEffect(() => {
		if (query.email && !email) setEmail(query.email as string)
	}, [router])

	const onGoogleSignIn = () => {
		loader(
			async () => {
				try {
					await signInWithPopup(firebaseAuth, provider)
					router.push("/")
					return [true]
				} catch (error: any) {
					const errorCode = error.code
					if (errorCode == "auth/popup-closed-by-user")
						return [false, "You closed the Pop-up"]
					console.error(error)
					return [false]
				}
			},
			{
				loading: "Logging In with Google....",
				success: "Logged In",
				error: "Problem in signing in with Google",
			}
		)
	}

	const onSendSignInLink = async () => {
		loader(
			async () => {
				try {
					if (!email) return [false, "Please enter the email"]
					if (!isEmailValid(email)) return [false, "Invalid Email ID"]
					await sendSignInLink(email, websiteConfig.frontendOrigin)
					return [true]
				} catch (error: any) {
					if (error?.code == "auth/invalid-email")
						return [false, "Invalid Email Address"]
					console.error(error)
					return [false]
				}
			},
			{
				success: "Link Sent to your Email ID, please check",
				error: "Oops! something went wrong in sending the link.",
				loading: "Sending Link...",
			}
		)
	}

	return (
		<main className={styles.login}>
			<form>
				<h1>Login / Register</h1>

				<input
					type="email"
					placeholder="Enter Your Email"
					required
					onChange={e => setEmail(e.target.value)}
					value={email}
				/>
				<button
					onClick={onSendSignInLink}
					type="button"
					className={`${styles.getSignInLinkButton} `}
				>
					Get Login Link
				</button>
				<button
					type="button"
					className={styles.googleLoginButton}
					onClick={onGoogleSignIn}
				>
					<GoogleIcon />
					<span>Login With Google</span>
				</button>
			</form>
		</main>
	)
}

export default ProtectedRoutesHOC(Login, true)
