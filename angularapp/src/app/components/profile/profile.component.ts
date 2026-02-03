import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BASE_URL } from 'src/app/config';
import { AuthService } from 'src/app/services/auth.service';
 
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
 
  username = '';
  email = '';
  mobileNumber = '';
  profileImage = 'assets/profilelogo.webp';
 
  isEditing = false;
  showSuccess = false;
  usernameError = false;
  emailError = false;
  mobileError = false;

  userId: number = 0;
  userRole = '';
  password = '';

  public apiUrl = `${BASE_URL}/api/user`;

  constructor(private http: HttpClient, public authservice: AuthService) {}

  getRole(): string {
    const role = this.authservice.getRole()?.toUpperCase();
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Admin',
      'USER': 'User'
    };
    return roleMap[role] || 'Unknown';
  }
  enableEdit(): void {
    this.isEditing = true;
  }
 
  cancelEdit(): void {
    this.isEditing = false;
    this.usernameError = false;
    this.emailError = false;
    this.mobileError = false;
  }
 
  updateProfile(): void {
    this.emailError = !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(this.email);
    this.mobileError = !/^\d{10}$/.test(this.mobileNumber);
 
    if (this.usernameError || this.emailError || this.mobileError) {
      return;
    }
 
    this.isEditing = false;
    this.showSuccess = true;
    const updatedUser = {
      userId: this.userId,
      username: this.username,
      email: this.email,
      mobileNumber: this.mobileNumber,
      password: this.password,
      userRole: this.userRole
    };
    this.http.put(`${this.apiUrl}/view/profile`, updatedUser).subscribe({
      next: () => {
        console.log('Profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      }
    });

    setTimeout(() => this.showSuccess = false, 3000);
  }

  

  ngOnInit(): void {
    this.userId = this.authservice.getAuthenticatedUserId();
    this.fetchUserProfile();
  }
  fetchUserProfile(): void {
    this.http.get<any>(`${this.apiUrl}/${this.userId}`).subscribe({
      next: (data) => {
        this.username = data.username;
        this.email = data.email;
        this.mobileNumber = data.mobileNumber;
        this.userRole = data.userRole;
        this.password = data.password;
      },
      error: (err) => console.error('Error fetching profile:', err)
    });
  }

  handleKeyPress(event: KeyboardEvent): void {
    
  }
}
