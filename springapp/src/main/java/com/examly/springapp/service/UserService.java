package com.examly.springapp.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import com.examly.springapp.model.User;

public interface UserService {
    User createUser(User user);
    UserDetails loadUserByUsername(String username);
    List<User>findAllUsers();
    User getByUserId(int userId);
    boolean deleteUser(int userId);
    User updateUser(User user);
    User findByUsername(String username);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);
    
    
}
