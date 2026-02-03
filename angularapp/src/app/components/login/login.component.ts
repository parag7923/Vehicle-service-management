import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http'; // Import this
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  username: string;
  password: string;
  isSubmitting = false;
 
  // --- NEW --- 
  errorMessage: string | null = null;
  passwordFieldType: string = 'password';
  // --- END NEW ---
 
  constructor(private authService: AuthService, private router: Router) { }
 
  ngOnInit(): void {}
 
  login() {
    if (this.username && this.password) {
      this.isSubmitting = true;
      this.errorMessage = null; // Clear previous errors
 
      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          // No alert, just navigate. The auth service will broadcast the change.
          
          // Navigate based on role from the (now reactive) auth service
          const role = this.authService.getRole();
          // if (role === 'ADMIN') {
          //   this.router.navigate(['/home']); // Or wherever admin goes
          // } else if (role === 'USER') {
          //   this.router.navigate(['/home']); // Or wherever user goes
          // } else {
          //   this.router.navigate(['/home']);
          // }
          this.router.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => { // Type the error
          this.isSubmitting = false;
          console.error('Login failed', error);
          
          // Set the specific error message from the backend
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password.';
          } else {
            this.errorMessage = 'Login failed. Please try again later.';
          }
        }
      });
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleDropdown();
      event.preventDefault(); // optional: prevents scrolling on spacebar
    }
  }
  toggleDropdown() {
    //throw new Error('Method not implemented.');
  }
 
  // --- NEW ---
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  // --- END NEW ---
}