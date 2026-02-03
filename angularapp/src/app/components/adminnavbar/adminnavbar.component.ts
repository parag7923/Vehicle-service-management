import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
 
@Component({
  selector: 'app-adminnavbar',
  templateUrl: './adminnavbar.component.html',
  styleUrls: ['./adminnavbar.component.css']
})
export class AdminnavbarComponent implements OnInit {
  showLogoutPopup = false;
  showSerDropdown: boolean;
 
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
 
  isAdmin(): boolean {
    return this.service.getRole() === 'ADMIN';
  }
 
  confirmLogout(): void {
    this.showLogoutPopup = true;
  }
 
  cancelLogout(): void {
    this.showLogoutPopup = false;
  }
 
  logout(): void {
    this.service.logout();
    this.showLogoutPopup = false;
    this.router.navigate(['/']);
  }
 
  toggleSerDropdown(): void {
    this.cancelLogout();
    this.showSerDropdown = !this.showSerDropdown;
  }
 
  closeDropdown(): void {
    this.showSerDropdown = false;
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleSerDropdown();
      event.preventDefault(); // prevents scrolling on spacebar
    }
  }
}