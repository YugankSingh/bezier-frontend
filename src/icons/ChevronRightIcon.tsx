import React from "react"

type Props = {
	size?: number
	className?: string
	title?: string
}

export default function ChevronRightIcon({
	size = 20,
	className,
	title,
}: Props) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden={title ? undefined : true}
			role={title ? "img" : "presentation"}
		>
			{title ? <title>{title}</title> : null}
			<path
				d="M9 18L15 12L9 6"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
