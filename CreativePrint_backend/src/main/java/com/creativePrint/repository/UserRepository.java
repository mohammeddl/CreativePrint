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
    // Basic queries
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Role based queries
    List<User> findByRole(Role role);

    Page<User> findByRole(Role role, Pageable pageable);

    // Status based queries
    List<User> findByActive(boolean active);

    Page<User> findByActive(boolean active, Pageable pageable);

    // Combined queries
    List<User> findByRoleAndActive(Role role, boolean active);

    Page<User> findByRoleAndActive(Role role, boolean active, Pageable pageable);

    // Search queries
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);

    // Custom update queries
    @Modifying
    @Query("UPDATE User u SET u.active = :status WHERE u.id = :userId")
    int updateUserStatus(@Param("userId") Long userId, @Param("status") boolean status);

    @Modifying
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.id = :userId")
    int updatePassword(@Param("userId") Long userId, @Param("newPassword") String newPassword);

    // Time-based queries
    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Statistics queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true AND u.role = :role")
    long countActiveByRole(@Param("role") Role role);

    // Login related queries
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);

    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = CURRENT_TIMESTAMP WHERE u.id = :userId")
    void updateLastLoginTime(@Param("userId") Long userId);

    // Complex queries
    @Query("""
            SELECT u FROM User u
            WHERE u.role = :role
            AND u.active = true
            AND u.createdAt >= :since
            ORDER BY u.createdAt DESC
            """)
    List<User> findRecentActiveUsersByRole(
            @Param("role") Role role,
            @Param("since") LocalDateTime since);

    @Query("""
            SELECT u FROM User u
            LEFT JOIN FETCH u.userProfile
            WHERE u.id = :userId
            """)
    Optional<User> findByIdWithProfile(@Param("userId") Long userId);

}
