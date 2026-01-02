import { configureWebsite } from "dukon-core-lib/library/frontend/websiteConfig"
configureWebsite(websiteConfig)

import "./globals.scss"
import "./markdown.scss"

import { auth as authFirebase } from "dukon-core-lib/library/frontend/firebase"
import { useEffect, useRef, useState } from "react"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"
import { onAuthStateChanged } from "firebase/auth"
import Navbar from "@/components/Navbar"
// import Login from "@/components/Login"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import Head from "next/head"
import { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import websiteConfig from "@/website.config"
import Script from "next/script"

export default function App({
	Component,
	pageProps,
}: {
	Component: any
	pageProps: any
}) {
	let toasterID = useRef("")
	const auth = useUserState(state => state.auth)
	const setAuth = useUserState(state => state.setAuth)
	const user = useUserState(state => state.user)
	const fetchUser = useUserState(state => state.fetchUserData)
	const logout = useUserState(state => state.logout)

	useEffect(() => {
		toasterID.current = toast.loading("Logging In....")
		onAuthStateChanged(authFirebase, async auth => {
			setAuth(auth)
			if (toasterID.current) toast.dismiss(toasterID.current)
		})
		return () => {
			toast.dismiss(toasterID.current)
		}
	}, [])

	useEffect(() => {
		if (auth) fetchUser()
	}, [auth])
	const GA_MEASUREMENT_ID = "G-4SHQ274XR7"

	return (
		<>
			{GA_MEASUREMENT_ID ? (
				<>
					<Script
						id="ga4-src"
						strategy="afterInteractive"
						src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
					/>
					<Script id="ga4-config" strategy="afterInteractive">
						{`
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
							`}
					</Script>
				</>
			) : null}

			<Head>
				<title>{websiteConfig.name}</title>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
				/>
				<link
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
					rel="stylesheet"
				/>
			</Head>
			<Toaster />
			<Navbar />

			<SkeletonTheme baseColor="#e7e7e7" highlightColor="#f3f3f3">
				<Component {...pageProps} />
			</SkeletonTheme>
			{/* <Footer /> */}
		</>
	)
}
