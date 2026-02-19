import styles from "../pages/login/Login.module.scss"
import { auth, provider } from "dukon-core-lib/library/frontend/firebase"
import { signInWithPopup, sendSignInLinkToEmail } from "firebase/auth"
import loader from "dukon-core-lib/library/frontend/util/toaster"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import GoogleIcon from "@/icons/GoogleIcon"
import isEmailValid from "dukon-core-lib/library/frontend/util/checkEmail"
import websiteConfig from "@/website.config"

type LoginRegisterFormMode = "page" | "modal"

interface LoginRegisterFormProps {
	mode?: LoginRegisterFormMode
	redirectTo?: string
	initialEmail?: string
	onLoggedIn?: () => void
}

function LoginRegisterForm({
	mode = "page",
	redirectTo,
	initialEmail = "",
	onLoggedIn,
}: LoginRegisterFormProps) {
	const router = useRouter()
	const [email, setEmail] = useState(initialEmail)

	useEffect(() => {
		setEmail(initialEmail)
	}, [initialEmail])

	const safeRedirectTo = useMemo(() => {
		if (!redirectTo || typeof redirectTo !== "string") return "/"
		if (!redirectTo.startsWith("/")) return "/"
		return redirectTo
	}, [redirectTo])

	const onGoogleSignIn = () => {
		loader(
			async () => {
				try {
					await signInWithPopup(auth, provider)
					onLoggedIn?.()
					if (mode === "page") router.push(safeRedirectTo)
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
			},
		)
	}

	const onSendSignInLink = async () => {
		loader(
			async () => {
				try {
					if (!email) return [false, "Please enter the email"]
					if (!isEmailValid(email)) return [false, "Invalid Email ID"]

					const actionCodeSettings = {
						url: `${websiteConfig.frontendOrigin}/login/finish-email-auth?redirect=${encodeURIComponent(
							safeRedirectTo,
						)}`,
						handleCodeInApp: true,
					}

					await sendSignInLinkToEmail(auth, email, actionCodeSettings)
					window.localStorage.setItem("emailForSignIn", email)
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
			},
		)
	}

	return (
		<div className={mode === "modal" ? styles.loginModal : styles.login}>
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
		</div>
	)
}

export default LoginRegisterForm
