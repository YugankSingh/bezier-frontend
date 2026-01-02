import React from "react"
import styles from "./CommonPagesViewHOC.module.scss"
import CartSum from "./CartSum"

function CommonPagesViewHOC(child: React.ReactElement, pageName: string) {
	return () => {
		return (
			<div className={styles.outerWrapper}>
				<div className={styles.wrapper}>
					<h3>{pageName}</h3>
					{child}
				</div>
			</div>
		)
	}
}

export default CommonPagesViewHOC
