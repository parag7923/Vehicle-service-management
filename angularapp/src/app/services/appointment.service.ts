import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { BASE_URL } from '../config';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
 
  // Make sure this URL is correct
  private apiUrl = `${BASE_URL}/api/appointment`;
 
  constructor(private http: HttpClient) {}

   // --- UPDATED: This function NOW REQUIRES a serviceId ---
   getAvailableSlots(date: string, serviceId: number): Observable<string[]> {
    // We pass both date and serviceId to the backend
    return this.http.get<string[]>(`${this.apiUrl}/available-slots`, {
      params: {
        date: date,
        serviceId: serviceId.toString() // Pass serviceId as a query parameter
      }
    });
  }
 
  // This function is for checking if a user has *already* booked this service
  // for this day. This logic remains correct.
  checkUserBooking(userId: number, serviceId: number, date: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-booking`, {
      params: {
        userId: userId.toString(),
        serviceId: serviceId.toString(),
        date: date
      }
    });
  }



  getAppointments(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getAppointmentsByUser(userId: number): Observable<any> {
    // This calls your controller's GET /{userId}
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }
  addAppointment(appointment: Appointment): Observable<any> {
    // This POST now sends the appointment with the timeSlot
    return this.http.post<any>(this.apiUrl, appointment);
  }
  updateAppointment(appointmentId: number, appointment: Appointment): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${appointmentId}`, appointment);
  }
  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${appointmentId}`);
  }
  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    const statusUpdate = { status: status };
    // This calls the @PutMapping("/{id}/status") endpoint
    return this.http.put<any>(`${this.apiUrl}/${appointmentId}/status`, statusUpdate);
  }
 
  // // --- *** NEW METHODS FOR SLOT BOOKING *** ---
 
  // /**
  //  * Gets available time slots for a specific date.
  //  * Calls GET /api/appointment/available-slots
  //  */
  // getAvailableSlots(date: string): Observable<string[]> {
  //   let params = new HttpParams().set('date', date);
  //   // This calls the @GetMapping("/available-slots") endpoint in your controller
  //   return this.http.get<string[]>(`${this.apiUrl}/available-slots`, { params });
  // }
 
  // /**
  //  * Checks if a user has already booked a specific service on a given date.
  //  * Calls GET /api/appointment/check-user-booking
  //  */
  // checkUserBooking(userId: number, serviceId: number, date: string): Observable<boolean> {
  //   let params = new HttpParams()
  //     .set('userId', userId.toString())
  //     .set('serviceId', serviceId.toString())
  //     .set('date', date);
    
  //   // This calls the @GetMapping("/check-user-booking") endpoint
  //   return this.http.get<boolean>(`${this.apiUrl}/check-user-booking`, { params });
  // }
}