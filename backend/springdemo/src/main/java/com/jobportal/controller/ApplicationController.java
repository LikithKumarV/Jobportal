package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private JobSeekerProfileRepository profileRepository; 

    @PostMapping
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> payload) {
        
        String email = (String) payload.get("email"); 
        
        if (email == null || email.isEmpty()) {
             return ResponseEntity.badRequest().body("User email is required");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        JobSeekerProfile profile = user.getJobSeekerProfile();
        if (profile == null) {
            profile = new JobSeekerProfile();
            profile.setUser(user);
            profile = profileRepository.save(profile);
        }

        Long jobId = Long.valueOf(payload.get("jobId").toString());
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // --- NEW: DUPLICATE CHECK ---
        boolean alreadyApplied = applicationRepository.existsByJobIdAndJobSeekerId(jobId, profile.getId());
        if (alreadyApplied) {
            return ResponseEntity.badRequest().body("You have already applied for this job!");
        }
        // ----------------------------

        Application app = new Application();
        app.setJob(job);
        app.setJobSeeker(profile);
        app.setCoverLetter((String) payload.get("coverLetter"));
        app.setAppliedDate(LocalDateTime.now());
        app.setStatus(ApplicationStatus.PENDING);

        applicationRepository.save(app);
        return ResponseEntity.ok("Application saved successfully");
    }
}