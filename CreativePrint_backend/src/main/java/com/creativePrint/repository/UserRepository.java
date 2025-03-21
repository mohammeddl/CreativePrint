package com.creativePrint.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.creativePrint.enums.Role;
import com.creativePrint.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    // Add this method for the admin functionality
    Page<User> findByActive(boolean active, Pageable pageable);

    // Add this method for the admin functionality
    Page<User> findByRoleAndActive(Role role, boolean active, Pageable pageable);

    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);

    @Modifying
    @Query("UPDATE User u SET u.active = :status WHERE u.id = :userId")
    int updateUserStatus(@Param("userId") Long userId, @Param("status") boolean status);

    @Modifying
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.id = :userId")
    int updatePassword(@Param("userId") Long userId, @Param("newPassword") String newPassword);

    @Modifying
    @Query("UPDATE User u SET u.updatedAt = CURRENT_TIMESTAMP WHERE u.id = :userId")
    void updateLastLoginTime(@Param("userId") Long userId);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.active = true")
    List<User> findActiveUsersByRole(@Param("role") Role role);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);
}