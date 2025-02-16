import { useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { ShoppingCart, Menu, X } from "lucide-react"
import type { RootState } from "../../store/store"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.length)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          PrintOnDemand
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="text-gray-600 hover:text-purple-600">
            Products
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-purple-600">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-purple-600">
            Contact
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="text-gray-600 hover:text-purple-600" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden">
            <nav className="flex flex-col items-center py-4 space-y-4">
              <Link to="/products" className="text-gray-600 hover:text-purple-600">
                Products
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-purple-600">
                About
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-purple-600">
                Contact
              </Link>
              <Link to="/cart" className="relative">
                <ShoppingCart className="text-gray-600 hover:text-purple-600" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

