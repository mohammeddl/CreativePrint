import { Link, Outlet } from "react-router-dom"
import { Users, ShoppingBag, BarChart2, LogOut } from "lucide-react"

const sidebarItems = [
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: ShoppingBag, label: "Products", path: "/admin/products" },
  { icon: BarChart2, label: "Statistics", path: "/admin/statistics" },
]

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-purple-600">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-600"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button className="flex items-center text-gray-700 hover:text-purple-600">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

