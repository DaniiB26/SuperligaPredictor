package com.example.predictor.controller;

import com.example.predictor.model.User;
import com.example.predictor.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/signup")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SignupController {

    private static final Logger logger = LoggerFactory.getLogger(SignupController.class);
    private final UserService userService;

    @PostMapping
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        logger.info("Received signup request for user: {}", user.getUsername());

        try {
            userService.loadUserByUsername(user.getUsername());
            logger.warn("Username {} is already taken!", user.getUsername());
            return ResponseEntity.badRequest().body("Username is already taken!");
        } catch (UsernameNotFoundException e) {
            logger.info("Username {} is available.", user.getUsername());
        }

        userService.saveUser(user);
        logger.info("User {} registered successfully!", user.getUsername());
        return ResponseEntity.ok("User registered successfully!");
    }
}