import { useMemo } from "react"
import { useRouter } from "next/router"
import ProtectedRoutesHOC from "dukon-core-lib/library/frontend/component/ProtectedRoutesHOC"
import LoginRegisterForm from "@/components/LoginRegisterForm"

function Login({}) {
	const router = useRouter()
	const { query } = router

	const initialEmail = useMemo(
		() => (query.email as string) || "",
		[query.email],
	)
	const redirectTo = useMemo(() => {
		const value = query.redirect
		if (!value || typeof value !== "string") return "/"
		return value
	}, [query.redirect])

	return (
		<main>
			<LoginRegisterForm
				mode="page"
				initialEmail={initialEmail}
				redirectTo={redirectTo}
			/>
		</main>
	)
}

export default ProtectedRoutesHOC(Login, true)
