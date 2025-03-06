import type React from "react"
import { FaBuilding, FaIdCard } from "react-icons/fa"
import type { RegisterFormData } from "../../../types/auth"

interface PartnerRegistrationFormProps {
  formData: RegisterFormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function PartnerRegistrationForm({ 
  formData, 
  handleChange 
}: PartnerRegistrationFormProps) {
  return (
    <>
      <div className="flex space-x-4">
        <div className="w-1/2 space-y-1">
          <label 
            htmlFor="companyName" 
            className="text-sm font-medium text-gray-700"
          >
            Company Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaBuilding className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="companyName"
              name="companyName"
              type="text"
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
              placeholder="Creative Designs Inc."
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="w-1/2 space-y-1">
          <label 
            htmlFor="businessType" 
            className="text-sm font-medium text-gray-700"
          >
            Business Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaBuilding className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="businessType"
              name="businessType"
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
              value={formData.businessType}
              onChange={handleChange}
            >
              <option value="">Select Business Type</option>
              <option value="MANUFACTURER">Manufacturer</option>
              <option value="SUPPLIER">Supplier</option>
              <option value="RETAILER">Retailer</option>
              <option value="WHOLESALER">Wholesaler</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <div className="w-1/2 space-y-1">
          <label 
            htmlFor="taxId" 
            className="text-sm font-medium text-gray-700"
          >
            Tax ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaIdCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="taxId"
              name="taxId"
              type="text"
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
              placeholder="AB1234567"
              value={formData.taxId}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="w-1/2 space-y-1">
          <label 
            htmlFor="commissionRate" 
            className="text-sm font-medium text-gray-700"
          >
            Commission Rate (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaIdCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="commissionRate"
              name="commissionRate"
              type="number"
              required
              min="0"
              max="100"
              step="0.1"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
              placeholder="Commission Rate"
              value={formData.commissionRate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}