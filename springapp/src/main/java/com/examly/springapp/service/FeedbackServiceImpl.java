package com.examly.springapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.model.Feedback;
import com.examly.springapp.repository.FeedbackRepo;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    
    private FeedbackRepo feedbackRepo;
    


    public FeedbackServiceImpl(FeedbackRepo feedbackRepo) {
        this.feedbackRepo = feedbackRepo;
    }

    @Override
    public Feedback createFeedback(Feedback feedback) {
        return feedbackRepo.save(feedback);
    }

    @Override
    public Feedback deleteFeedback(Long feedbackId) {
        Feedback found = feedbackRepo.findById(feedbackId).orElse(null);
        if (found == null) {
            return null;
        }
        feedbackRepo.deleteById(feedbackId);
        return found;
    }

    @Override
    public List<Feedback> getAllFeedback() {
        return feedbackRepo.findAll();
    }

    @Override
    public Feedback getFeedbackById(Long feedbackId) {
        return feedbackRepo.findById(feedbackId).orElse(null);
    }

    @Override
    public List<Feedback> getFeedbackByUserId(int userId) {
        return feedbackRepo.findByUserId(userId);
    }
}