import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../models/feedback.model';
import { BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = `${BASE_URL}/api/feedback`;

  constructor(private http: HttpClient) {}

  createFeedback(feedback: Feedback): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, feedback);
  }

  getAllFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }

  updateFeedback(feedbackId: number, feedback: Feedback): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${feedbackId}`, feedback);
  }

  deleteFeedback(feedbackId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${feedbackId}`);
  }

  getFeedbackByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/user/${userId}`);
  }
}