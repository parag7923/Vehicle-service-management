package com.examly.springapp.controller;

import com.examly.springapp.model.Feedback;
import com.examly.springapp.service.FeedbackServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackServiceImpl feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('USER')") // Uncomment this if using role-based access
    public ResponseEntity<Feedback> createFeedback(@RequestBody Feedback feedback) {
        Feedback created = feedbackService.createFeedback(feedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        Feedback feedback = feedbackService.getFeedbackById(id);
        if (feedback == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(feedback);
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedbackList = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbackList);
    }

    
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Map<String, String>> deleteFeedback(@PathVariable Long id) {
    feedbackService.deleteFeedback(id);
    Map<String, String> response = new HashMap<>();
    response.put("message", "Feedback deleted successfully with ID: " + id);
    return ResponseEntity.ok(response);
}


    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Feedback>> getFeedbackByUserId(@PathVariable int userId) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByUserId(userId);
        return ResponseEntity.ok(feedbackList);
    }
}