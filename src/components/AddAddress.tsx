import React, { useEffect, useRef, useState } from "react"
import styles from "./AddAddress.module.scss"
import { useUserState } from "dukon-core-lib/library/frontend/states/user"
import { useOrderState } from "dukon-core-lib/library/frontend/states/order"
import { AddressDTO, AddressErrors } from "dukon-core-lib/library/common/types"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import { useAddressState } from "dukon-core-lib/library/frontend/states/address"
import Modal from "./Modal"
import {
	addressFields,
	checkAddress,
	checkAddressField,
} from "dukon-core-lib/library/backend-frontend/checkers/address"

const emptyAddressErrors: AddressErrors = {
	name: "",
	contactNumber: "",
	line1: "",
	line2: "",
	city: "",
	pincode: "",
	country: "",
	state: "",
}

const emptyAddress: AddressDTO = {
	...{
		name: "",
		contactNumber: "",
		line1: "",
		line2: "",
		city: "",
		pincode: "",
		country: "",
		state: "",
	},
	...Object.fromEntries(
		addressFields.map(field => [field.id, field.defaultValue || ""])
	),
}

type AddAddressFormProps = {
	onChangeAddress: (index: number, field: string, value: string) => void
	address: AddressDTO
	addressError: AddressErrors
}

function AddAddressForm({
	onChangeAddress,
	address,
	addressError,
}: AddAddressFormProps) {
	return (
		<div>
			<br />
			<div>
				{addressFields.map((field, index) => (
					<div className="s12 input-field white-text" key={field.id}>
						{field.type === "select" ? (
							<>
								<div>{field.label}</div>
								<select
									id={field.id}
									onChange={e =>
										onChangeAddress(index, field.id, e.target.value)
									}
									className="white-text"
									value={address[field.id as keyof AddressDTO]}
								>
									{field.isDefaultName && (
										<option
											value=""
											disabled
											className="grey-text text-lighten-1"
										>
											{field.label}
										</option>
									)}
									{field.selectOptions?.map(option => (
										<option
											value={option.value}
											className="white-text"
											key={option.value}
										>
											{option.name}
										</option>
									))}
								</select>
								<span className="helper-text red-text text-lighten-2">
									{addressError[field.id as keyof AddressErrors] || ""}
								</span>
							</>
						) : (
							<>
								<label htmlFor={field.id} className="active white-text">
									{field.label}
								</label>
								<input
									id={field.id}
									type={field.type}
									className="white-text validate"
									onChange={e =>
										onChangeAddress(index, field.id, e.target.value)
									}
									value={address[field.id as keyof AddressDTO]}
									required
								/>
								<span className="helper-text red-text text-lighten-2">
									{addressError[field.id as keyof AddressErrors] || ""}
								</span>
							</>
						)}
					</div>
				))}
			</div>{" "}
		</div>
	)
}

function AddAddressWrapper() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [address, setAddress] = useState<AddressDTO>(emptyAddress)
	const [addressError, setAddressError] =
		useState<AddressErrors>(emptyAddressErrors)
	const isProceeding = useRef(false)

	const addNewAddress = useAddressState(state => state.addNewAddress)

	const onChangeAddress = (index: number, field: string, value: string) => {
		const addressField = addressFields[index]
		const { isError, shouldWrite, error } = checkAddressField(
			value,
			addressField
		)
		if (!isError) {
			setAddressError(prevErrors => ({ ...prevErrors, [field]: "" }))
		} else {
			setAddressError(prevErrors => ({ ...prevErrors, [field]: error }))
		}
		if (shouldWrite)
			setAddress(prevAddress => ({ ...prevAddress, [field]: value }))
	}

	const onClearAll = async () => {
		setAddress(emptyAddress)
		setIsModalOpen(false)
	}

	const onProceed = async () => {
		if (isProceeding.current) {
			return toast("Already Proceeding... Please wait", { icon: "⚠️" })
		}

		const { isError, error } = checkAddress(address)
		if (isError) return toast.error(error)

		isProceeding.current = true

		const isSuccessful = await addNewAddress(address)
		isProceeding.current = false
		if (!!isSuccessful) {
			setIsModalOpen(false)
			setAddress(emptyAddress)
			setAddressError(emptyAddressErrors)
		}
	}

	const addresses = useAddressState(state => state.addresses)

	useEffect(() => {
		if (!!addresses && !addresses.length) setIsModalOpen(true)
	}, [addresses])

	return (
		<div>
			<a className="button important" onClick={() => setIsModalOpen(true)}>
				Add new address
			</a>
			<Modal
				handleClose={onClearAll}
				handleProceed={onProceed}
				handleCancel={onClearAll}
				shouldShow={isModalOpen}
				heading="Add New Address"
				text=""
				CustomElement={AddAddressForm}
				CustomElementProps={{ onChangeAddress, address, addressError }}
				proceedButtonText="Add address"
			/>
		</div>
	)
}

export default AddAddressWrapper
