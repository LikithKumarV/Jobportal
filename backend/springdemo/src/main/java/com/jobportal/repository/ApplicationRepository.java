package com.jobportal.repository;

import com.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    // 1. Used by ApplicationService (For Employers to see applicants)
    List<Application> findByJobId(Long jobId);
    
    // 2. Used by ApplicationService (Internal logic)
    List<Application> findByJobSeekerId(Long jobSeekerId);

    // 3. Used by JobSeekerController (For Dashboard "My Applications")
    @Query("SELECT a FROM Application a WHERE a.jobSeeker.user.email = :email")
    List<Application> findByUserEmail(String email);

    // 4. Used by ApplicationController (To prevent duplicate applications)
    boolean existsByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);
}