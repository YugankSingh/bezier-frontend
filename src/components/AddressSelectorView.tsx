import { Address } from "dukon-core-lib/library/common/types"
import React from "react"
import styles from "./AddressSelectorView.module.scss"
import { useAddressState } from "dukon-core-lib/library/frontend/states/address"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import { stringOrObjectID } from "dukon-core-lib/library/common/util"

type AddressSelectorViewProps = {
	address: Address
	onSelect: () => void
	isSelected: boolean
}

function AddressSelectorView({
	address,
	onSelect,
	isSelected,
}: AddressSelectorViewProps) {
	const deleteAddress = useAddressState(state => state.deleteAddress)
	const defaultAddress = useUserState(state => state.user.data.defaultAddress)
	const makeAddressDefault = useUserState(state => state.makeAddressDefault)

	const onDelete = () => {
		deleteAddress(address._id)
	}
	const onMakeDefault = () => {
		makeAddressDefault(address._id)
	}

	const isDefaultAddress =
		defaultAddress &&
		stringOrObjectID(defaultAddress) === stringOrObjectID(address)

	return (
		<div
			onClick={onSelect}
			className={`hoverDivision ${styles.container} ${
				isSelected ? styles.selected : ""
			}`}
		>
			{/* Selected checkmark indicator */}
			{isSelected && <div className={styles.checkmark}>✓</div>}

			{/* Display Address Details */}
			<div className={styles.name}>{address.name}</div>
			<div className={styles.contact}>Phone no. - {address.contactNumber}</div>
			<div className={styles.contact}>
				{address.line1}, {address.line2}, {}
			</div>
			<div className={styles.contact}>
				{address.city}, {address.state}, {address.pincode}, {address.country}
			</div>
			<div>
				<a className={styles.deleteButton} onClick={onDelete}>
					Delete
				</a>
				<span>{" | "}</span>
				{isDefaultAddress ? (
					<span>Default Address</span>
				) : (
					<a className={styles.makeDefaultButton} onClick={onMakeDefault}>
						Make Default
					</a>
				)}
			</div>
		</div>
	)
}

export default AddressSelectorView
