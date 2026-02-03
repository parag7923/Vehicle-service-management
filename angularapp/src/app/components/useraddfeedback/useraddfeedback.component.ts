import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {
  newFeedback: Feedback = {
    user: {} as any,
    message: '',
    rating: null
  };
 
  showSuccessPopup: boolean = false;
  stars: number[] = [1, 2, 3, 4, 5];
 
  constructor(private feedbackService: FeedbackService, private router: Router) {}
 
  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.newFeedback.user = { userId: parseInt(userId) };
    } else {
      console.error('User ID not found in localStorage');
    }
  }
 
  submitFeedback() {
    this.feedbackService.createFeedback(this.newFeedback).subscribe({
      next: () => {
        this.showSuccessPopup = true;
        this.newFeedback.message = '';
        this.newFeedback.rating = 0;
      },
      error: (error) => {
        console.error('Error in adding feedback:', error);
      }
    });
  }
 
  closePopup(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/userviewfeedback']);
  }
 
  setRating(rating: number): void {
    this.newFeedback.rating = rating;
  }
 
  isStarFilled(star: number): boolean {
    return star <= this.newFeedback.rating;
  }
}
