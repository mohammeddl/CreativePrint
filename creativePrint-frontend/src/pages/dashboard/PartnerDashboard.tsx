import { Route, Routes } from 'react-router-dom'
import PartnerDashboardLayout from '../../components/layout/PartnerDashboardLayout'
import PartnerDashboardHome from './PartnerDashboardHome'
import PartnerDesignsPage from './PartnerDesignsPage'
import UploadDesignForm from './UploadDesignForm'
import PartnerProductsPage from './PartnerProductsPage'
import ProductForm from './ProductForm'
import TldrawEditor from '../../components/dashboard/TldrawEditor'
import PartnerOrdersPage from './PartnerOrdersPage'

export default function PartnerDashboard() {
  return (
    <Routes>
      <Route path="/" element={<PartnerDashboardLayout />}>
        <Route index element={<PartnerDashboardHome />} />
        <Route path="designs" element={<PartnerDesignsPage />} />
        <Route path="designs/new" element={<UploadDesignForm />} />
        <Route path="products" element={<PartnerProductsPage />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="orders" element={<PartnerOrdersPage />} />
        <Route path='designs/editor' element={<TldrawEditor />} />
      </Route>
    </Routes>
  )
}