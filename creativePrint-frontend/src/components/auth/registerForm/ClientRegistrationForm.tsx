import type React from "react";
import { HiUser } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";
import type { RegisterFormData } from "../../../types/auth";

interface ClientRegistrationFormProps {
  formData: RegisterFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ClientRegistrationForm({
  formData,
  handleChange,
}: ClientRegistrationFormProps) {
  return (
    <>
      <div className='flex space-x-4'>
        <div className='w-1/2 space-y-1'>
          <label
            htmlFor='shippingAddress'
            className='text-sm font-medium text-gray-700'>
            Shipping Address
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <HiUser className='h-5 w-5 text-gray-400' />
            </div>
            <input
              id='shippingAddress'
              name='shippingAddress'
              type='text'
              required
              className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out'
              placeholder='123 Main St'
              value={formData.shippingAddress}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='w-1/2 space-y-1'>
          <label
            htmlFor='billingAddress'
            className='text-sm font-medium text-gray-700'>
            Billing Address
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <HiUser className='h-5 w-5 text-gray-400' />
            </div>
            <input
              id='billingAddress'
              name='billingAddress'
              type='text'
              className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out'
              placeholder='Same as shipping'
              value={formData.billingAddress}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className='space-y-1'>
        <label
          htmlFor='phoneNumber'
          className='text-sm font-medium text-gray-700'>
          Phone Number
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <FaPhoneAlt className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='phoneNumber'
            name='phoneNumber'
            type='tel'
            required
            className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out'
            placeholder='+1234567890'
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}
