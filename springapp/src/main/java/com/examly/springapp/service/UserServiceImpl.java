package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepo;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepo userRepo;

    public UserServiceImpl(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public User createUser(User user) {
        return userRepo.save(user);
    }

    @Override
    public boolean deleteUser(int userId) {
        User found = userRepo.findById(userId).orElse(null);
        if (found != null) {
            userRepo.delete(found);
            return true;
        }
        return false;
    }

    @Override
    public List<User> findAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getByUserId(int userId) {
        return userRepo.findById(userId).orElse(null);
    }

    @Override
    public User findByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    // 🔐 SPRING SECURITY METHOD
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepo.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserRole()))
        );
    }

    @Override
    public User updateUser(User user) {

        Optional<User> optionalUser = userRepo.findById(user.getUserId());

        if (optionalUser.isEmpty()) {
            return null;
        }

        User existingUser = optionalUser.get();
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setMobileNumber(user.getMobileNumber());

        return userRepo.save(existingUser);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    @Override
    public boolean existsByMobileNumber(String mobileNumber) {
        return userRepo.existsByMobileNumber(mobileNumber);
    }
}
