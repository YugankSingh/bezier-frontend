import styles from "./Shop.module.scss"
import ProductCard from "@/components/ProductCard"
import ProductFilters from "@/components/ProductFilters"
import { fetchProductsList } from "@/util/globals"
import { Product } from "dukon-core-lib/library/common/types"
import websiteConfig from "@/website.config"

export default function Shop({ products }: { products: Product[] }) {
	return (
		<main className={styles.shop}>
			<div className={styles.listNFilter}>
				<div className={styles.filter}>
					<ProductFilters />
				</div>
				<div className={styles.productsList}>
					{products.map(product => (
						<ProductCard
							key={product._id}
							product={product}
							storeID={websiteConfig.storeID}
						/>
					))}
				</div>
			</div>
		</main>
	)
}

export async function getStaticProps() {

	const products = (await fetchProductsList()) as unknown as Product[]
	let filteredProducts = products.filter(product => !!product)

	return {
		props: { products: filteredProducts },
		revalidate: 60,
	}
}
