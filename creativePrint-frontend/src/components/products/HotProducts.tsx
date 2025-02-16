import { useSelector } from "react-redux"
import ProductCard from "./ProductCard"
import type { RootState } from "../../store/store"

export default function HotProducts() {
  const products = useSelector((state: RootState) => state.products.items)
  const hotProducts = products.filter((product) => product.isHot)

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Hot Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

