import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { 
  LayoutGrid, 
  Package, 
  ShoppingBag, 
  Palette, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight
} from "lucide-react"
import { logoutUser } from "../../store/slices/userSlice"

export default function PartnerDashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const sidebarItems = [
    { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
    { icon: Palette, label: "Designs", path: "/dashboard/designs" },
    { icon: Package, label: "Products", path: "/dashboard/products" },
    { icon: ShoppingBag, label: "Orders", path: "/dashboard/orders" },
  ]

  const handleLogout = () => {
    dispatch(logoutUser() as any)
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-500 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="text-xl font-semibold text-purple-600">Partner Dashboard</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white shadow-md overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-purple-600">Partner Dashboard</h1>
          </div>
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium ${
                  isActive(item.path)
                    ? "text-purple-600 bg-purple-50 border-r-4 border-purple-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 w-64 p-6">
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar - Slide Over */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
              onClick={toggleMobileMenu}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="flex-1 h-0 overflow-y-auto">
                <div className="p-4 flex items-center justify-between">
                  <h1 className="text-xl font-bold text-purple-600">Partner Dashboard</h1>
                  <button 
                    onClick={toggleMobileMenu}
                    className="text-gray-500 focus:outline-none"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="mt-5">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 text-base font-medium ${
                        isActive(item.path)
                          ? "text-purple-600 bg-purple-50 border-l-4 border-purple-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-base font-medium text-red-600"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}