import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  constructor(private fb: FormBuilder, private service: AuthService, private router: Router) {

    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern('^[A-Za-z][A-Za-z0-9_]*$')
      ]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      confirmPassword: ['', Validators.required],
      mobileNumber: ['', [
        Validators.required,
        Validators.pattern('^[6-9]\\d{9}$')
      ]],
      userRole: ['', Validators.required]
    },
      {
        validators: this.passwordMatchValidator
      });
  }
  ngOnInit(): void { }
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  onSubmit() {
   
    this.errorMessage = null;
    this.successMessage = null;
 
    if (this.registerForm.valid) {
     this.service.register(this.registerForm.value).subscribe(
         
        
         (result) => {
           this.successMessage = "Registration successful! Redirecting to login...";
           this.registerForm.reset();
           
         
           setTimeout(() => {
             this.router.navigate(['/login']);
           }, 2000);
         },
 
        
         (error: HttpErrorResponse) => {
           // We DON'T reset the form, so the user can fix their mistake.
           
           // We DON'T navigate away. We show the error on this page.
           
           // Check if the backend sent a specific error message
           if (error.error && typeof error.error.message === 'string') {
             // This handles a JSON response like { "message": "Username already exists" }
             this.errorMessage = error.error.message;
           } else if (error.error && typeof error.error === 'string') {
             // This handles a plain text response from the backend
             this.errorMessage = error.error;
           } else {
             // This is a fallback for network errors or other generic issues
             this.errorMessage = "Registration not done. An unknown error occurred. Please try again later.";
           }
         }
       );
    } else {
      // Form is invalid, so we mark all fields as touched to show errors
      this.registerForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
 
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  handleKeyPress(event: KeyboardEvent): void {
    
  }
  
}
