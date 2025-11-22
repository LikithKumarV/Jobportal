package com.jobportal.controller;

import com.jobportal.entity.Application;
import com.jobportal.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/jobseeker")
@CrossOrigin(origins = "http://localhost:3000")
public class JobSeekerController {

    @Autowired
    private ApplicationRepository applicationRepository;

    // 1. GET DASHBOARD STATISTICS
    // FIX: Added @RequestParam to catch the email sent from React
    @GetMapping("/dashboard/stats")
    public Map<String, Object> getStats(@RequestParam String email) {
        
        // Safety check
        if (email == null || email.equals("User") || email.isEmpty()) {
             return Map.of("totalApplications", 0, "pendingApplications", 0);
        }
        
        // Fetch real data using the email param
        List<Application> myApps = applicationRepository.findByUserEmail(email);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", myApps.size());
        
        long pending = myApps.stream()
                .filter(a -> "PENDING".equals(a.getStatus().name())) 
                .count();
                
        stats.put("pendingApplications", pending);
        return stats;
    }

    // 2. GET MY APPLICATION LIST
    // FIX: Added @RequestParam to catch the email sent from React
    @GetMapping("/applications")
    public Map<String, Object> getMyApplications(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();

        if (email == null || email.equals("User") || email.isEmpty()) {
            response.put("content", new ArrayList<>()); 
            return response;
        }
        
        List<Application> myApps = applicationRepository.findByUserEmail(email);
        response.put("content", myApps); 
        return response;
    }
}