package com.jobportal.service;

import com.jobportal.entity.Application;
import com.jobportal.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    // Apply for a job
    public Application applyForJob(Application application) {
        // You could add logic here to check if they already applied!
        return applicationRepository.save(application);
    }

    // Get applications for a specific job (For Employers)
    public List<Application> getApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    // Get applications made by a user (For Job Seekers)
    public List<Application> getMyApplications(Long jobSeekerId) {
        return applicationRepository.findByJobSeekerId(jobSeekerId);
    }
}