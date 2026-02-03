import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserdetailsService } from 'src/app/services/userdetails.service';

@Component({
  selector: 'app-adminviewuserdetails',
  templateUrl: './adminviewuserdetails.component.html',
  styleUrls: ['./adminviewuserdetails.component.css']
})
export class AdminviewuserdetailsComponent implements OnInit {

  allCustomers: User[] = [];
  filteredCustomers: User[] = [];
  searchForm: FormGroup;
  userNotFound: boolean = false;
 
  // Popup states
  showConfirmPopup: boolean = false;
  showSuccessPopup: boolean = false;
  userIdToDelete: number | null = null;
  successMessage: string = '';
 
  constructor(private fb: FormBuilder, private userService: UserdetailsService) {}
 
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      username: ['']
    });
    this.loadCustomers();
  }
 
  loadCustomers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.allCustomers = users.filter(user => user.userRole?.toUpperCase() === 'USER');
        this.filteredCustomers = [...this.allCustomers];
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }
 
  onSearch(): void {
    const searchTerm = this.searchForm.get('username')?.value.toLowerCase().trim();
    if (!searchTerm) {
      this.filteredCustomers = [...this.allCustomers];
      this.userNotFound = false;
      return;
    }
    this.filteredCustomers = this.allCustomers.filter(user =>
      user.username?.toLowerCase().includes(searchTerm)
    );
    this.userNotFound = this.filteredCustomers.length === 0;
  }
 
  // Show confirmation popup
  onDeleteUser(userId: number | undefined): void {
    if (!userId) {
      console.error('Cannot delete: User ID is undefined.');
      return;
    }
    this.userIdToDelete = userId;
    this.showConfirmPopup = true;
  }
 
  // Confirm deletion
  confirmDelete(): void {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete).subscribe({
        next: () => {
          this.allCustomers = this.allCustomers.filter(user => user.userId !== this.userIdToDelete);
          this.filteredCustomers = this.filteredCustomers.filter(user => user.userId !== this.userIdToDelete);
          this.showConfirmPopup = false;
          this.successMessage = 'User deleted successfully!';
          this.showSuccessPopup = true;
          setTimeout(() => this.closePopup(), 3000); // Auto-close success popup
        },
        error: (err) => {
          console.error(`Error deleting user ${this.userIdToDelete}:`, err);
          alert('Failed to delete user. Please try again.');
        }
      });
    }
  }
 
  cancelDelete(): void {
    this.showConfirmPopup = false;
    this.userIdToDelete = null;
  }
 
  closePopup(): void {
    this.showSuccessPopup = false;
  }
}
 