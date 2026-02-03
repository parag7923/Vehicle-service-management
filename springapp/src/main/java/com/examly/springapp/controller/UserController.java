package com.examly.springapp.controller;
 
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.examly.springapp.config.JwtUtils;
import com.examly.springapp.model.LoginAuthenticationDto;
import com.examly.springapp.model.User;
import com.examly.springapp.model.UserDto;
import com.examly.springapp.service.UserService;
import com.examly.springapp.service.UserServiceImpl;
 
@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    AuthenticationManager manager;
 
    @Autowired
    JwtUtils jwtUtils;
 
    @Autowired
    UserDetailsService userDetailsService;
 
    @Autowired
    private PasswordEncoder passwordEncoder;
 
    @PostMapping("/register")
    
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        
        // --- START OF UPDATED VALIDATION ---
        // We use Map<String, String> to send back error messages,
        // just like you do in your deleteUserById method.
        
        // 1. Check for existing username
        if (userService.existsByUsername(user.getUsername())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error: Username is already taken!");
            return ResponseEntity.badRequest().body(response);
        }
 
        // 2. Check for existing email
        if (userService.existsByEmail(user.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error: Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }
 
        // 3. Check for existing mobile number
        if (userService.existsByMobileNumber(user.getMobileNumber())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error: Mobile number is already registered!");
            return ResponseEntity.badRequest().body(response);
        }
 
        // --- END OF UPDATED VALIDATION ---
 
        // 4. If all checks pass, proceed with registration
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User created = userService.createUser(user);
        
        if (created == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error: User could not be created. Please try again later.");
            // 500 Internal Server Error, as this shouldn't happen if validation passed
            return ResponseEntity.status(500).body(response); 
        }
        
        // 201 Created
        return ResponseEntity.status(201).body(created);
    }
   
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
        try {
            Authentication authentication = manager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword())
            );
 
            if (authentication.isAuthenticated()) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userDto.getUsername());
                User user = userService.findByUsername(userDto.getUsername());
 
                LoginAuthenticationDto data = new LoginAuthenticationDto();
                data.setToken(jwtUtils.generateToken(userDetails));
                data.setUsername(user.getUsername());
                data.setUserRole(user.getUserRole());
                data.setUserId(user.getUserId());
 
                
                return ResponseEntity.ok(data);
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
 
        return ResponseEntity.status(401).body("Authentication failed");
    }
 
 
    @GetMapping("/user")
    public ResponseEntity<List<User>>getAllUser(){
        List<User> foundList=userService.findAllUsers();
        if(foundList==null){
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.status(200).body(foundList);
    }
 
    @PutMapping("/user/view/profile")
    public ResponseEntity<User>updateUser(@RequestBody User user){
        User updated=userService.updateUser(user);
        if(updated==null){
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.status(200).body(updated);
    }
 
    @GetMapping("/user/{userId}")
    public ResponseEntity<User>getUserById(@PathVariable int userId){
        User got=userService.getByUserId(userId);
        if(got==null){
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(got);
    }
 
    @GetMapping("/name/{name}")
    public ResponseEntity<?>getUserByName(@PathVariable String name){
        User user=userService.findByUsername(name);
        if(user==null){
            return ResponseEntity.status(200).body(user);
        }
        return ResponseEntity.status(404).build();
    }
 
    @DeleteMapping("/user/{id}")
    public ResponseEntity<Map<String, String>> deleteUserById(@PathVariable int id) {
        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully.");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found.");
            return ResponseEntity.status(404).body(response);
        }
    }
  
}
 