import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-userviewfeedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {
  userFeedbacks: Feedback[] = [];

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getAuthenticatedUserId();

    if (userId) {
      this.feedbackService.getFeedbackByUserId(userId).subscribe({
        next: (data) => {
          this.userFeedbacks = data;
        },
        error: (error) => {
          console.error('Error fetching user feedback:', error);
        }
      });
    } else {
      console.error('User not logged in or userId not found.');
    }
  }
}