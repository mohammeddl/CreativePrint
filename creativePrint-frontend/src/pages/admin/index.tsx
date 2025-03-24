import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { fetchAdminData } from "../../store/slices/adminSlice";
import type { RootState } from "../../store/store";
import AdminLayout from "../../components/admin/AdminLayout";
import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement";
import ProductManagement from "./ProductManagement";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminData());
  }, [dispatch]);

  if (loading && !document.querySelector('.admin-dashboard')) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
        </Route>
      </Routes>
    </div>
  );
}