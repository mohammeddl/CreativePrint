// src/pages/admin/AdminPermissions.tsx
import React, { useState, useEffect } from 'react';
import { Shield, Save, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../components/services/api/admin.service';
import type { Role, Permission } from '../../types/admin';

export default function AdminPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    try {
      setLoading(true);
      
      // Fetch roles and permissions
      const [rolesResponse, permissionsResponse] = await Promise.all([
        adminService.getRoles(),
        adminService.getPermissions()
      ]);
      
      setRoles(rolesResponse || []);
      setPermissions(permissionsResponse || []);
      
      // Set the first role as active
      if (rolesResponse && rolesResponse.length > 0) {
        setActiveTab(rolesResponse[0].name);
      }
    } catch (error) {
      console.error('Error fetching roles and permissions:', error);
      toast.error('Failed to load roles and permissions');
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
        adminService.updateRolePermissions(role.id, role.permissions)
      ));
      
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to format permission name for display
  const formatPermissionName = (permissionName: string): string => {
    return permissionName
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // Helper function to format category name
  const formatCategoryName = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Helper function to group permissions by category
  const groupPermissionsByCategory = (permissions: Permission[]): Record<string, Permission[]> => {
    return permissions.reduce((groups, permission) => {
      const [category] = permission.name.split('.');
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
  };

  // Helper function to check if a permission is essential for admin role
  const isEssentialAdminPermission = (permissionName: string): boolean => {
    const essentialPermissions = ['admin.access', 'users.manage'];
    return essentialPermissions.includes(permissionName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  const activeRole = getActiveRole();
  const groupedPermissions = groupPermissionsByCategory(permissions);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
        <button
          onClick={savePermissions}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
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
              {Object.entries(groupedPermissions).map(([category, perms]) => (
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