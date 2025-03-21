import React, { useState } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../components/services/api/axios';

interface SystemSettings {
  orderEmailNotifications: boolean;
  allowUserRegistration: boolean;
  maintenanceMode: boolean;
  maxProductsPerPartner: number;
  maxOrdersPerDay: number;
  siteName: string;
  companyAddress: string;
  supportEmail: string;
  currency: string;
  defaultLanguage: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    orderEmailNotifications: true,
    allowUserRegistration: true,
    maintenanceMode: false,
    maxProductsPerPartner: 100,
    maxOrdersPerDay: 1000,
    siteName: 'Creative Print',
    companyAddress: '123 Print Avenue, Design City, DC 12345',
    supportEmail: 'support@creativeprint.com',
    currency: 'USD',
    defaultLanguage: 'en'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setSettings(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (type === 'number') {
      setSettings(prev => ({
        ...prev,
        [name]: parseInt(value, 10)
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call API to save settings
      await api.post('/admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    // Reset to default or to the last saved settings
    setSettings({
      orderEmailNotifications: true,
      allowUserRegistration: true,
      maintenanceMode: false,
      maxProductsPerPartner: 100,
      maxOrdersPerDay: 1000,
      siteName: 'Creative Print',
      companyAddress: '123 Print Avenue, Design City, DC 12345',
      supportEmail: 'support@creativeprint.com',
      currency: 'USD',
      defaultLanguage: 'en'
    });
    
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* General Settings Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  id="siteName"
                  name="siteName"
                  type="text"
                  value={settings.siteName}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <input
                  id="supportEmail"
                  name="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address
                </label>
                <textarea
                  id="companyAddress"
                  name="companyAddress"
                  rows={3}
                  value={settings.companyAddress}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Language
                  </label>
                  <select
                    id="defaultLanguage"
                    name="defaultLanguage"
                    value={settings.defaultLanguage}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* System Settings Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">System Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center">
                  <input
                    id="orderEmailNotifications"
                    name="orderEmailNotifications"
                    type="checkbox"
                    checked={settings.orderEmailNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="orderEmailNotifications" className="ml-2 block text-sm text-gray-900">
                    Send Order Email Notifications
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Send email notifications for new orders, shipping updates, etc.
                </p>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    id="allowUserRegistration"
                    name="allowUserRegistration"
                    type="checkbox"
                    checked={settings.allowUserRegistration}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowUserRegistration" className="ml-2 block text-sm text-gray-900">
                    Allow User Registration
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  If disabled, only admins can create new accounts.
                </p>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    id="maintenanceMode"
                    name="maintenanceMode"
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                    Maintenance Mode
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Only administrators can access the site when in maintenance mode.
                </p>
              </div>
              
              <div>
                <label htmlFor="maxProductsPerPartner" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Products Per Partner
                </label>
                <input
                  id="maxProductsPerPartner"
                  name="maxProductsPerPartner"
                  type="number"
                  min="1"
                  value={settings.maxProductsPerPartner}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="maxOrdersPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Orders Per Day
                </label>
                <input
                  id="maxOrdersPerDay"
                  name="maxOrdersPerDay"
                  type="number"
                  min="1"
                  value={settings.maxOrdersPerDay}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={isSubmitting}
          >
            <RotateCcw className="w-4 h-4 mr-2 inline-block" />
            Reset to Default
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}