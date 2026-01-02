import {
	Product,
	VariantObject,
	VariantsList,
	VariantType,
} from "dukon-core-lib/library/common/types"

export const calculatePrices = (variantsList: VariantsList) => {
	let minMp = Infinity,
		maxMp = -Infinity,
		minSp = Infinity,
		maxSp = -Infinity

	for (let variatsListKey in variantsList) {
		const { mp, sp } = variantsList[variatsListKey]
		minMp = Math.min(minMp, mp)
		maxMp = Math.max(maxMp, mp)
		minSp = Math.min(minSp, sp)
		maxSp = Math.max(maxSp, sp)
	}

	return { minMp, maxMp, minSp, maxSp }
}
