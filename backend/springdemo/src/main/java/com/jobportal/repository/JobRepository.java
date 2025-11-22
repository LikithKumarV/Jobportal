package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    // Find all jobs posted by a specific employer
    List<Job> findByEmployerId(Long employerId);
    
    // Search for jobs containing a keyword in the title (Case insensitive)
    List<Job> findByTitleContainingIgnoreCase(String keyword);
    
    // Find jobs by location
    List<Job> findByLocationContainingIgnoreCase(String location);
}