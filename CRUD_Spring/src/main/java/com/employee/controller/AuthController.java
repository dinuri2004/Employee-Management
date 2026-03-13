package com.employee.controller;

import com.employee.entity.User;
import com.employee.repository.UserRepository;
import com.employee.service.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createResponse(false, "Username already exists"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createResponse(false, "Email already exists"));
        }

        User user = new User(username, email, password);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("user", Map.of("username", username, "email", email));
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createResponse(false, "Invalid username or password"));
        }

        User user = userOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", Map.of("username", user.getUsername(), "email", user.getEmail()));
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createResponse(false, "No account found with this email address"));
        }

        User user = userOpt.get();
        
        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Send email
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
            System.out.println("Password reset requested for: " + email);
            return ResponseEntity.ok(createResponse(true, "Password reset link has been sent to your email"));
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createResponse(false, "Failed to send email. Please check email configuration."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        Optional<User> userOpt = userRepository.findByResetToken(token);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createResponse(false, "Invalid reset token"));
        }

        User user = userOpt.get();
        
        // Check if token has expired
        if (user.getResetTokenExpiry() == null || 
            LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createResponse(false, "Reset token has expired. Please request a new one."));
        }

        // Update password and clear reset token
        user.setPassword(newPassword);
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        System.out.println("Password reset successful for user: " + user.getUsername());
        return ResponseEntity.ok(createResponse(true, "Password has been reset successfully"));
    }

    private Map<String, Object> createResponse(boolean success, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        return response;
    }
}
