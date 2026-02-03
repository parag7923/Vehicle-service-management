package com.examly.springapp.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import com.examly.springapp.model.User;
 
@Repository
public interface UserRepo extends JpaRepository<User,Integer> {

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);
   
    User findByUsername(String name);
   
}