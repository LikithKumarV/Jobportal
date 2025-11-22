package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployerController {

    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;
    
    // Make sure you have this Repository! If not, I can give you the code.
    @Autowired private EmployerProfileRepository employerProfileRepository; 

    // 1. CREATE A NEW JOB
    @PostMapping("/jobs")
    public Job postJob(@RequestBody Job job) {
        // Get current user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get or Create Employer Profile
        EmployerProfile employer = user.getEmployerProfile();
        if (employer == null) {
            employer = new EmployerProfile();
            employer.setUser(user);
            employer.setCompanyName("My Company"); // Default name, editable later
            employer.setLocation("Remote");
            employer = employerProfileRepository.save(employer);
        }

        // Set Job details
        job.setEmployer(employer);
        job.setPostedDate(LocalDateTime.now());
        job.setStatus("ACTIVE");
        
        return jobRepository.save(job);
    }

    // 2. GET MY POSTED JOBS
    @GetMapping("/jobs")
    public Map<String, Object> getMyJobs() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        
        List<Job> jobs = new ArrayList<>();
        if (user != null && user.getEmployerProfile() != null) {
            // We need a custom method in JobRepository for this
            // or we can filter manually for now:
            Long employerId = user.getEmployerProfile().getId();
            jobs = jobRepository.findAll().stream()
                    .filter(j -> j.getEmployer() != null && j.getEmployer().getId().equals(employerId))
                    .collect(Collectors.toList());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("content", jobs);
        return response;
    }

    // 3. DASHBOARD STATS
    @GetMapping("/dashboard/stats")
    public Map<String, Object> getStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        
        long totalJobs = 0;
        long activeJobs = 0;

        if (user != null && user.getEmployerProfile() != null) {
            Long employerId = user.getEmployerProfile().getId();
            List<Job> myJobs = jobRepository.findAll().stream()
                    .filter(j -> j.getEmployer() != null && j.getEmployer().getId().equals(employerId))
                    .collect(Collectors.toList());
            
            totalJobs = myJobs.size();
            activeJobs = myJobs.stream().filter(j -> "ACTIVE".equals(j.getStatus())).count();
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs", totalJobs);
        stats.put("activeJobs", activeJobs);
        return stats;
    }
}