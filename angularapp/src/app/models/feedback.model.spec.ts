import { Feedback } from './feedback.model';

describe('FeedbackModel', () => {

  fit('frontend_Feedback_model_should_create_an_instance', () => {
    const feedback: Feedback = {
      feedbackId: 1,
      user:{
      userId: 456,
      },
      message: 'Great service and support!',
      rating: 5
    };
    expect(feedback).toBeTruthy();    
    expect(feedback.message).toBeDefined();
    expect(feedback.rating).toBeDefined();
  });

});
