import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showDropdown = false;
  showLogoutPopup = false;
  isLoggedIn = false;
 
  constructor(private router: Router, private service:AuthService) { }
 
  ngOnInit(): void {
  }
 
  isAdmin(){
    return this.service.isAdmin();
  }
 
  isCustomer(){
    return this.service.isUser();
  }
 
  isUserLoggedIn():boolean{
    return this.service.isLoggedIn();
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
 
  confirmLogout(): void {
    this.showLogoutPopup = true;
  }
 
  cancelLogout(): void {
    this.showLogoutPopup = false;
  }
 
  logout(): void {
    this.showLogoutPopup = false;
    this.service.logout()
    this.router.navigate(['/home']);
  }
}