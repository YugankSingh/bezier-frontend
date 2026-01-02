import CommonPagesViewHOC from "@/components/CommonPagesViewHOC"
import ProtectedRoutesHOC from "dukon-core-lib/library/frontend/component/ProtectedRoutesHOC"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import Skeleton from "react-loading-skeleton"
import hocStyles from "@/components/CommonPagesViewHOC.module.scss"
import OrdersList from "@/components/OrdersList"

function Account() {
	const logout = useUserState(state => state.logout)
	const userAuth = useUserState(state => state.auth)
	const user = useUserState(state => state.user)
	if (!user || !userAuth) return <Skeleton height={600} width={`100%`} />

	return (
		<div>
			{/* <div className={hocStyles.actions}></div> */}

			<div className={hocStyles.main}>
				{/* <div className={hocStyles.secondaryDivFirst}>= </div> */}
				<div className="hoverDivision">
					<div className="information" style={{ padding: "0 20px" }}>
						<h5>
							Email : <small>{userAuth.email || user.data?.email}</small>
						</h5>
						<h5>
							Name : <small>{userAuth.displayName}</small>
						</h5>
						<button onClick={() => logout(true)} className="button important">
							Log Out
						</button>
						<br />
						<br />

						<h4>Orders</h4>
						<OrdersList />
					</div>
				</div>
				<div className={hocStyles.secondaryDivSecond}>
					{/* <CartSum
						cartItems={cartItems}
						onProceed={onProceed}
						proceedText="Pay"
						areProductsFetched={true}
					/> */}
				</div>
			</div>
		</div>
	)
}

export default ProtectedRoutesHOC(
	CommonPagesViewHOC(<Account />, "Profile & Orders")
)
