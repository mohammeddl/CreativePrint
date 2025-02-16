"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "../../store/slices/productSlice"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import ProductGrid from "../../components/products/ProductGrid"
import FilterSidebar from "../../components/products/FilterSidebar"
import HotProducts from "../../components/products/HotProducts"
import type { RootState } from "../../store/store"

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { filteredItems, loading, error } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4">
            <FilterSidebar />
          </aside>
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Our Products</h1>
            <ProductGrid products={filteredItems} />
          </div>
        </div>
        <HotProducts />
      </main>
      <Footer />
    </div>
  )
}

