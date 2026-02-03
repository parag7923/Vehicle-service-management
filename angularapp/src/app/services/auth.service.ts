import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs'; // Import BehaviorSubject and Observable
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { BASE_URL } from '../config';
 
// Constants for localStorage keys
export const AUTHENTICATED_USER = 'authenticatedUser';
export const TOKEN = 'token';
export const PAGE_ID = 'pageId';
export const USER_ID = 'userId';
export const ROLE = 'role';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  public baseUrl = `${BASE_URL}/api`;
 
  // --- START OF REACTIVE CHANGES ---
 
  // 1. Create private subjects to hold the current state
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);
 
  // 2. Expose public observables for components to listen to
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  public userRole$: Observable<string | null> = this.userRoleSubject.asObservable();
 
  // --- END OF REACTIVE CHANGES ---
 
  constructor(private http: HttpClient) {
    // 3. Load the initial state from localStorage when the app starts
    this.loadInitialState();
  }
 
  // 4. New private method to check localStorage on app load
  private loadInitialState(): void {
    const user = localStorage.getItem(AUTHENTICATED_USER);
    const role = localStorage.getItem(ROLE);
 
    if (user && role) {
      // If user is found in storage, update the subjects
      this.isLoggedInSubject.next(true);
      this.userRoleSubject.next(role);
    } else {
      // Otherwise, ensure subjects are set to logged-out state
      this.isLoggedInSubject.next(false);
      this.userRoleSubject.next(null);
    }
  }
 
  register(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
 
  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, { username, password }).pipe(
      map(
        data => {
          // You still save to localStorage
          localStorage.setItem(USER_ID, "" + data.userId);
          localStorage.setItem(AUTHENTICATED_USER, username);
          localStorage.setItem(TOKEN, `Bearer ${data.token}`);
          localStorage.setItem(ROLE, data.userRole);
 
          // 5. Broadcast the new state to all listeners!
          this.isLoggedInSubject.next(true);
          this.userRoleSubject.next(data.userRole);
 
          return data;
        }
      )
    );
  }
 
  logout(): void {
    localStorage.clear();
    
    // 6. Broadcast the new logged-out state
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
  }
 
  // --- METHODS BELOW ARE UPDATED TO USE THE REACTIVE STATE ---
  // (Your AuthGuards will now work correctly by calling these)
 
  getRole(): string | null { // Return type changed for safety
    return this.userRoleSubject.value;
  }
 
  isLoggedIn(): boolean {
    // Read from the subject's current value
    return this.isLoggedInSubject.value;
  }
 
  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
  
  isUser(): boolean {
    return this.getRole() === 'USER';
  }
 
  // --- OTHER METHODS (unchanged, but still work) ---
 
  getAuthenticatedUserId(): number {
    return parseInt(localStorage.getItem(USER_ID) || "0");
  }
 
  getAuthenticatedUser() {
    return localStorage.getItem(AUTHENTICATED_USER);
  }
 
  // This one still reads from storage, which is fine, but getRole() is better
  getAuthenticatedRole() {
    return localStorage.getItem(ROLE);
  }
 
  getAuthenticatedToken() {
    if (this.isLoggedIn()) // Use the reactive method
      return localStorage.getItem(TOKEN);
    return null; // Added return null for safety
  }
 
  pageId(): string {
    var pageId = localStorage.getItem(PAGE_ID);
    if (pageId === null) {
      localStorage.setItem(PAGE_ID, 'login');
    }
    return pageId;
  }
 
  setPageId(pageId: string) {
    localStorage.setItem(PAGE_ID, pageId);
  }
 
}
