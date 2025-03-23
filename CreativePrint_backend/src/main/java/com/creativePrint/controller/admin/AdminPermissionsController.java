package com.creativePrint.controller.admin;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminPermissionsController {

    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllRoles() {
        // In a real application, you would retrieve roles from a database
        List<Map<String, Object>> roles = new ArrayList<>();

        // Admin role
        Map<String, Object> adminRole = new HashMap<>();
        adminRole.put("id", 1);
        adminRole.put("name", "ADMIN");
        adminRole.put("description", "Administrator with full access");
        adminRole.put("permissions", Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12));
        roles.add(adminRole);

        // Client role
        Map<String, Object> clientRole = new HashMap<>();
        clientRole.put("id", 2);
        clientRole.put("name", "CLIENT");
        clientRole.put("description", "Regular customer");
        clientRole.put("permissions", Arrays.asList(1, 5, 9));
        roles.add(clientRole);

        // Partner role
        Map<String, Object> partnerRole = new HashMap<>();
        partnerRole.put("id", 3);
        partnerRole.put("name", "PARTNER");
        partnerRole.put("description", "Design partner");
        partnerRole.put("permissions", Arrays.asList(1, 2, 3, 5, 9, 10, 11));
        roles.add(partnerRole);

        return ResponseEntity.ok(roles);
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllPermissions() {
        // In a real application, you would retrieve permissions from a database
        List<Map<String, Object>> permissions = new ArrayList<>();

        // Product permissions
        addPermission(permissions, 1, "products.view", "View products");
        addPermission(permissions, 2, "products.create", "Create products");
        addPermission(permissions, 3, "products.edit", "Edit products");
        addPermission(permissions, 4, "products.delete", "Delete products");

        // Order permissions
        addPermission(permissions, 5, "orders.view", "View orders");
        addPermission(permissions, 6, "orders.manage", "Manage orders");

        // User permissions
        addPermission(permissions, 7, "users.view", "View users");
        addPermission(permissions, 8, "users.manage", "Manage users");

        // Design permissions
        addPermission(permissions, 9, "designs.view", "View designs");
        addPermission(permissions, 10, "designs.create", "Create designs");
        addPermission(permissions, 11, "designs.edit", "Edit designs");

        // Admin permissions
        addPermission(permissions, 12, "admin.access", "Access admin panel");

        return ResponseEntity.ok(permissions);
    }

    @PutMapping("/roles/{roleId}/permissions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateRolePermissions(
            @PathVariable Long roleId,
            @RequestBody Map<String, List<Integer>> request) {

        // In a real application, you would update role permissions in a database
        List<Integer> permissions = request.get("permissions");

        // Create response
        Map<String, Object> response = new HashMap<>();
        response.put("roleId", roleId);
        response.put("permissions", permissions);
        response.put("updated", true);

        return ResponseEntity.ok(response);
    }

    private void addPermission(List<Map<String, Object>> permissions, int id, String name, String description) {
        Map<String, Object> permission = new HashMap<>();
        permission.put("id", id);
        permission.put("name", name);
        permission.put("description", description);
        permissions.add(permission);
    }
}