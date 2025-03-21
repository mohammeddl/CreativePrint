import React, { useState, useEffect } from 'react';
import { Shield, Save, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../components/services/api/axios';

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: number[];
}

export default function AdminPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('CLIENT');

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    try {
      setLoading(true);
      
      // Make API call to fetch roles and permissions
      const [rolesResponse, permissionsResponse] = await Promise.all([
        api.get('/admin/roles'),
        api.get('/admin/permissions')
      ]);
      
      setRoles(rolesResponse.data || []);
      setPermissions(permissionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching roles and permissions:', error);
      toast.error('Failed to load roles and permissions');
      
      // Sample data for demo/testing
      setPermissions([
        { id: 1, name: 'products.view', description: 'View products' },
        { id: 2, name: 'products.create', description: 'Create products' },
        { id: 3, name: 'products.edit', description: 'Edit products' },
        { id: 4, name: 'products.delete', description: 'Delete products' },
        { id: 5, name: 'orders.view', description: 'View orders' },
        { id: 6, name: 'orders.manage', description: 'Manage orders' },
        { id: 7, name: 'users.view', description: 'View users' },
        { id: 8, name: 'users.manage', description: 'Manage users' },
        { id: 9, name: 'designs.view', description: 'View designs' },
        { id: 10, name: 'designs.create', description: 'Create designs' },
        { id: 11, name: 'designs.edit', description: 'Edit designs' },
        { id: 12, name: 'admin.access', description: 'Access admin panel' },
      ]);
      
      setRoles([
        { 
          id: 1, 
          name: 'ADMIN', 
          description: 'Administrator with full access', 
          permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] 
        },
        { 
          id: 2, 
          name: 'CLIENT', 
          description: 'Regular customer', 
          permissions: [1, 5, 9] 
        },
        { 
          id: 3, 
          name: 'PARTNER', 
          description: 'Design partner', 
          permissions: [1, 2, 3, 5, 9, 10, 11] 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (roleId: number, permissionId: number) => {
    setRoles(prevRoles => prevRoles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        const newPermissions = hasPermission
          ? role.permissions.filter(p => p !== permissionId)
          : [...role.permissions, permissionId];
        
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };

  const getActiveRole = () => {
    return roles.find(role => role.name === activeTab) || null;
  };

  const savePermissions = async () => {
    try {
      setSaving(true);
      
      // Call API to save role permissions
      await Promise.all(roles.map(role => 
        api.put(`/admin/roles/${role.id}/permissions`, { permissions: role.permissions })
      ));
      
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  const activeRole = getActiveRole();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
        <button
          onClick={savePermissions}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          {saving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Roles Tabs */}
        <div className="flex border-b">
          {roles.map(role => (
            <button
              key={role.id}
              className={`py-3 px-6 text-sm font-medium ${
                activeTab === role.name 
                  ? 'border-b-2 border-purple-600 text-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(role.name)}
            >
              {role.name}
            </button>
          ))}
        </div>

        {/* Role Description */}
        {activeRole && (
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-medium text-gray-900">{activeRole.name}</h2>
            <p className="text-sm text-gray-500">{activeRole.description}</p>
          </div>
        )}

        {/* Permissions List */}
        {activeRole && (
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Permissions</h3>
            <div className="space-y-4">
              {/* Group permissions by category */}
              {Object.entries(groupPermissionsByCategory(permissions)).map(([category, perms]) => (
                <div key={category} className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 font-medium text-gray-700">
                    {formatCategoryName(category)}
                  </div>
                  <div className="divide-y">
                    {perms.map(permission => (
                      <div 
                        key={permission.id} 
                        className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-700">{formatPermissionName(permission.name)}</p>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                        <button
                          onClick={() => handlePermissionToggle(activeRole.id, permission.id)}
                          className={`p-2 rounded-full ${
                            activeRole.permissions.includes(permission.id)
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          disabled={activeRole.name === 'ADMIN' && isEssentialAdminPermission(permission.name)}
                          title={
                            activeRole.name === 'ADMIN' && isEssentialAdminPermission(permission.name)
                              ? 'Essential admin permission cannot be disabled'
                              : activeRole.permissions.includes(permission.id)
                                ? 'Disable permission'
                                : 'Enable permission'
                          }
                        >
                          {activeRole.permissions.includes(permission.id) ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <X className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format permission name for display
function formatPermissionName(permissionName: string): string {
  return permissionName
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// Helper function to format category name
function formatCategoryName(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// Helper function to group permissions by category
function groupPermissionsByCategory(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce((groups, permission) => {
    const [category] = permission.name.split('.');
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);
}

// Helper function to check if a permission is essential for admin role
function isEssentialAdminPermission(permissionName: string): boolean {
  const essentialPermissions = ['admin.access', 'users.manage'];
  return essentialPermissions.includes(permissionName);
}