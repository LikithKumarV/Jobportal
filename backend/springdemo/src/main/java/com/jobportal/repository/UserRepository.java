package com.jobportal.repository;

import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring automatically implements this based on the name!
    Optional<User> findByEmail(String email);
    
    // Checks if an email already exists
    boolean existsByEmail(String email);
}