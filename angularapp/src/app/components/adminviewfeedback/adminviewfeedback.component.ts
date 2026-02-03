import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
 
@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {
  showConfirmPopup: boolean = false;
  showSuccessPopup: boolean = false;
  feedbackIdToDelete: number | null = null;
  allFeedbacks: Feedback[] = [];
 
  constructor(private feedbackService: FeedbackService) {}
 
  ngOnInit(): void {
    this.loadFeedbacks();
  }
 
  loadFeedbacks() {
    this.feedbackService.getAllFeedback().subscribe({
      next: (data) => {
        this.allFeedbacks = data;
      },
      error: (error) => {
        console.error('Error fetching all feedback:', error);
      }
    });
  }
 
 
 
  promptDelete(id: number) {
    this.feedbackIdToDelete = id;
    this.showConfirmPopup = true;
  }
 
  confirmDelete() {
    if (this.feedbackIdToDelete !== null) {
      this.feedbackService.deleteFeedback(this.feedbackIdToDelete).subscribe({
        next: () => {
          this.showConfirmPopup = false;
          this.showSuccessPopup = true;
          this.feedbackIdToDelete = null;
          setTimeout(() => this.closePopup(), 3000); // Auto-close success popup
          this.loadFeedbacks();
        },
        error: (err) => console.error('Error deleting feedback:', err)
      });
    }
  }
 
  cancelDelete() {
    this.showConfirmPopup = false;
    this.feedbackIdToDelete = null;
  }
 
  closePopup() {
    this.showSuccessPopup = false;
  }
}
 
