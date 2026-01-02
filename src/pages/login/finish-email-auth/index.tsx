// import styles from "@/styles/Login.module.scss"
import { signInWithEmailLink, updateProfile } from "firebase/auth"
import { useEffect, useState, useRef } from "react"
import styles from "../Login.module.scss"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import { Email, Customer } from "dukon-core-lib/library/common/types"
import loader from "dukon-core-lib/library/frontend/util/toaster"
import { auth } from "dukon-core-lib/library/frontend/firebase"
import ProtectedRoutesHOC from "dukon-core-lib/library/frontend/component/ProtectedRoutesHOC"
import Link from "next/link"

interface EmailAuthProps {
	user: Customer
}

function EmailAuth({ user }: EmailAuthProps) {
	const [email, setEmail] = useState("")
	const [isEmailInStorage, setIsEmailInStorage] = useState(false)
	const isSigningIn = useRef(false)
	const router = useRouter()

	useEffect(() => {
		if (!!user) return
		const email = window.localStorage.getItem("emailForSignIn")
		if (!email) {
			toast("Enter Your Email Address")
			return
		}
		setEmail(email)
		setIsEmailInStorage(true)
		signIn(email)
	}, [])

	const signIn = async (email: string) => {
		if (isSigningIn.current) return
		isSigningIn.current = true
		await loader(
			async () => {
				try {
					const { user } = await signInWithEmailLink(
						auth,
						email,
						window.location.href
					)
					window.localStorage.removeItem("emailForSignIn")
					router.push("/")
					return [true]
				} catch (error: any) {
					if (error.code == "auth/invalid-email")
						return [false, "Sorry, the Email is not correct."]
					if (error.code == "auth/invalid-action-code")
						return [
							false,
							"Seems, like this link is invalid, or probably you created a new one.",
						]
					console.error(error)
					return [false]
				}
			},
			{
				success: "Signed In",
				loading: "Signing In....",
				error: "Problem in Signing in, please enter your email",
			},
			() => {
				setIsEmailInStorage(false)
			}
		)
		isSigningIn.current = false
	}

	return (
		<main className={styles.login}>
			<form>
				<h1>Confirm Email Address</h1>
				<input
					type="email"
					placeholder="Enter Your Email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					disabled={isEmailInStorage}
				/>
				<button type="button" onClick={() => signIn(email)}>
					Sign In
				</button>
				<br />
				<Link href={`/login?email=${email}`}>Get Another Link</Link>
			</form>
		</main>
	)
}

export default ProtectedRoutesHOC(EmailAuth, true)
