import { useDispatch, useSelector } from "react-redux"
import { setSelectedCategory } from "../../store/slices/productSlice"
import type { RootState } from "../../store/store"

export default function FilterSidebar() {
  const dispatch = useDispatch()
  const { categories, selectedCategory } = useSelector((state: RootState) => state.products)

  const handleCategoryChange = (category: string | null) => {
    dispatch(setSelectedCategory(category))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
      <ul className="space-y-2">
        <li>
          <button
            className={`w-full text-left py-2 px-4 rounded ${
              selectedCategory === null ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleCategoryChange(null)}
          >
            All Categories
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              className={`w-full text-left py-2 px-4 rounded ${
                selectedCategory === category ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

