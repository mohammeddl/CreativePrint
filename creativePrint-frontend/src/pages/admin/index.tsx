import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route } from "react-router-dom"
import { fetchAdminData } from "../../store/slices/adminSlice"
import type { RootState } from "../../store/store"
import UserManagement from "../../components/admin/UserManagement"
import ProductApproval from "../../components/admin/ProductApproval"
import Statistics from "../../components/admin/Statistics"
import AdminLayout from "../../components/admin/AdminLayout"

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state: RootState) => state.admin)

  useEffect(() => {
    dispatch(fetchAdminData())
  }, [dispatch])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="users" element={<UserManagement />} />
        <Route path="products" element={<ProductApproval />} />
        <Route path="statistics" element={<Statistics />} />
        <Route index element={<Statistics />} />
      </Route>
    </Routes>
  )
}

