package com.jobportal.controller;

import com.jobportal.entity.Job;
import com.jobportal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    public Job postJob(@RequestBody Job job) {
        return jobService.postJob(job);
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // FIX: Combined search method to handle Frontend request
    @GetMapping("/search")
    public List<Job> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location) {
        
        // Get all jobs and filter them in Java (Simple approach)
        // In a real production app, you would do this filtering in the Database (Repository)
        List<Job> allJobs = jobService.getAllJobs();

        return allJobs.stream()
            .filter(job -> {
                // Check Keyword (Title)
                boolean matchesKeyword = (keyword == null || keyword.isEmpty()) || 
                    (job.getTitle() != null && job.getTitle().toLowerCase().contains(keyword.toLowerCase()));
                
                // Check Location
                boolean matchesLocation = (location == null || location.isEmpty()) || 
                    (job.getLocation() != null && job.getLocation().toLowerCase().contains(location.toLowerCase()));
                
                return matchesKeyword && matchesLocation;
            })
            .collect(Collectors.toList());
    }
    
    // Helper to get single job details
    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getAllJobs().stream()
                .filter(j -> j.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}