import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
 
@Component({
  selector: 'app-usernavbar',
  templateUrl: './usernavbar.component.html',
  styleUrls: ['./usernavbar.component.css']
})
export class UsernavbarComponent implements OnInit {
  showLogoutPopup = false;
  showAppointmentsDropdown = false;
  showFeedbackDropdown = false;
 
  constructor(public service: AuthService, private router: Router) {}
 
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showLogoutPopup = false;
      }
    });
  }
 
  isUserLoggedIn(): boolean {
    return this.service.isLoggedIn();
  }
 
  isCustomer(): boolean {
    return this.service.getRole() === 'USER';
  }
 
  confirmLogout(): void {
    this.showLogoutPopup = true;
  }
 
  cancelLogout(): void {
    this.showLogoutPopup = false;
  }
 
  toggleAppointmentsDropdown(): void {
    this.cancelLogout();
    this.showAppointmentsDropdown = !this.showAppointmentsDropdown;
    this.showFeedbackDropdown = false;
   
  }
 
  toggleFeedbackDropdown(): void {
    this.cancelLogout();
    this.showFeedbackDropdown = !this.showFeedbackDropdown;
    this.showAppointmentsDropdown = false;
   
  }
 
  logout(): void {
    this.service.logout();
    this.showLogoutPopup = false;
    this.router.navigate(['/home']);
  }
 
  closeAllDropdowns(): void {
    this.showAppointmentsDropdown = false;
    this.showFeedbackDropdown = false;
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleDropdown();
      event.preventDefault(); 
    }
  }
  toggleDropdown() {
  }
}
