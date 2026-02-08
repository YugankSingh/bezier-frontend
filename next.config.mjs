/** @type {import('next').NextConfig} */

const shouldMinify = process.env.NODE_ENV === "production"

const nextConfig = {
	transpilePackages: ["dukon-core-lib"],
	swcMinify: shouldMinify,
}

export default nextConfig
