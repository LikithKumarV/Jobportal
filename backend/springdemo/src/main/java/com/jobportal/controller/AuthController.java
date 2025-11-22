package com.jobportal.controller;

import com.jobportal.entity.User;
import com.jobportal.entity.UserRole;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64; // <--- Added this import
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        if (user.getRole() == null) {
            try {
                user.setRole(UserRole.JOB_SEEKER); 
            } catch (Exception e) {
                System.out.println("Error setting default role: " + e.getMessage());
            }
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("user", user);
                
                // --- FIX: GENERATE A MOCK JWT (Header.Payload.Signature) ---
                // This allows the React frontend to decode the ROLE correctly.
                
                // 1. Header (Static Base64 for {"alg":"HS256","typ":"JWT"})
                String header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
                
                // 2. Payload (We inject the REAL role here)
                String rawPayload = "{\"sub\":\"" + user.getEmail() + "\", \"role\":\"" + user.getRole() + "\", \"name\":\"" + user.getFullName() + "\"}";
                String payload = Base64.getEncoder().encodeToString(rawPayload.getBytes());
                
                // 3. Signature (Fake, but needed for structure)
                String signature = "fake-signature-123";
                
                // Combine them into a valid-looking token
                String token = header + "." + payload + "." + signature;
                // -----------------------------------------------------------

                response.put("token", token); 
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }
}