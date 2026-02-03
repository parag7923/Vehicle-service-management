package com.examly.springapp.service;
 
import java.util.List;
import com.examly.springapp.model.Feedback;
 
public interface FeedbackService {
    public Feedback createFeedback(Feedback feedback);
    public Feedback getFeedbackById(Long feedbackId);
    public List<Feedback> getAllFeedback();
    public Feedback deleteFeedback(Long feedbackId);
    public List<Feedback> getFeedbackByUserId(int userId);
    
}