import ProtectedRoutesHOC from "dukon-core-lib/library/frontend/component/ProtectedRoutesHOC"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import Skeleton from "react-loading-skeleton"
import toast from "react-hot-toast"
import CartSum from "@/components/CartSum"
import {
	Address,
	AddressDTO,
	AddressErrors,
} from "dukon-core-lib/library/common/types"
import { useOrderState } from "dukon-core-lib/library/frontend/states/order"
import AddAddress from "@/components/AddAddress"
import { useAddressState } from "dukon-core-lib/library/frontend/states/address"
import AddressSelectorView from "@/components/AddressSelectorView"
import CommonPagesViewHOC from "@/components/CommonPagesViewHOC"
import hocStyles from "@/components/CommonPagesViewHOC.module.scss"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import { stringOrObjectID } from "dukon-core-lib/library/common/util"

function LoadingAddress() {
	return <Skeleton height={600} width={`100%`} />
}

function SelectAddress() {
	const cartItems = useOrderState(state => state.cartItems)
	const resetCurrentOrder = useOrderState(state => state.resetCurrentOrder)
	const address = useOrderState(state => state.address)
	const setAddress = useOrderState(state => state.setAdress)
	const router = useRouter()
	const addresses = useAddressState(state => state.addresses)
	const fetchAddresses = useAddressState(state => state.fetchAddresses)
	const defaultAddress = useUserState(state => state.user.data.defaultAddress)

	useEffect(() => {
		if (!cartItems || !cartItems.length) router.push("/checkout/cart")
	}, [cartItems, router])

	useEffect(() => {
		if (!addresses) fetchAddresses()
	}, [])

	useEffect(() => {
		if (!defaultAddress) return
		const address = (addresses || []).find(
			address => stringOrObjectID(address) === stringOrObjectID(defaultAddress)
		)
		if (!address) return

		setAddress(address)
	}, [defaultAddress])

	if (!cartItems || !addresses) return <LoadingAddress />

	const onBack = () => {
		resetCurrentOrder()
		router.back()
	}

	const onProceed = async () => {
		if (!address) return toast.error("Select an address first")
		router.push("/checkout/pay")
	}

	return (
		<div>
			<div className={hocStyles.actions}>
				<button className="button" onClick={onBack}>
					Back
				</button>
			</div>

			<div className={hocStyles.main}>
				<div className={hocStyles.secondaryDivFirst}>
					<CartSum
						cartItems={cartItems}
						onProceed={onProceed}
						proceedText="Pay"
						areProductsFetched={true}
					/>
				</div>
				<div>
					<div
						style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
					>
						{addresses.map((currAddress: Address) => (
							<AddressSelectorView
								address={currAddress}
								onSelect={() => setAddress(currAddress)}
								isSelected={!!address && address._id === currAddress._id}
							/>
						))}
					</div>
					<div style={{ margin: "10px 0" }}>
						<AddAddress />
					</div>
				</div>
				<div className={hocStyles.secondaryDivSecond}>
					<CartSum
						cartItems={cartItems}
						onProceed={onProceed}
						proceedText="Pay"
						areProductsFetched={true}
					/>
				</div>
			</div>
		</div>
	)
}

export default ProtectedRoutesHOC(
	CommonPagesViewHOC(<SelectAddress />, "Select Address")
)
