import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment.model';
import { User } from 'src/app/models/user.model';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-useraddappointment',
  templateUrl: './useraddappointment.component.html',
  styleUrls: ['./useraddappointment.component.css']
})
export class UseraddappointmentComponent implements OnInit, OnDestroy {
 
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
 
  // Data for table rows
  public allServices: VehicleMaintenance[] = [];
  public paginatedServices: VehicleMaintenance[] = [];
 
  // Auth & messages
  currentUser: User | null = null;
  globalErrorMessage: string = ''; // For table loading
  successMessage: string = '';
  showSuccessPopup: boolean = false;
 
  // Date helpers
  today: string = ''; // 'YYYY-MM-DD'
 
  private popupTimer: any = null;
 
  // --- Booking Modal State ---
  public showBookingModal = false;
  public selectedServiceForBooking: VehicleMaintenance | null = null;
  public modalAppointmentDate = '';
  public modalLocation = '';
  public modalTimeSlot = '';
  public modalAvailableSlots: string[] = [];
  public modalIsLoadingSlots = false;
  public modalErrorMessage: string | null = null;
 
  private readonly LOCATION_REGEX = /^[A-Za-z ]+$/;
 
  constructor(
    private appointmentService: AppointmentService,
    private vehicleService: VehicleService,
    private authService: AuthService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.loadCurrentUser();
    this.loadServices();
  }
 
  ngOnDestroy(): void {
    if (this.popupTimer) {
      clearTimeout(this.popupTimer);
    }
  }
 
  // ---------- Data loading ----------
 
  loadCurrentUser(): void {
    const userId = this.authService.getAuthenticatedUserId();
    const username = this.authService.getAuthenticatedUser();
    const email = this.authService.getAuthenticatedUser();
    const userRole = this.authService.getAuthenticatedUser();
 
    if (userId && username && email && userRole) {
      this.currentUser = {
        userId: userId,
        username: username,
        email: email,
        userRole: userRole
      };
    } else {
      this.globalErrorMessage = 'User not logged in. Please log in to book an appointment.';
    }
  }
 
  loadServices(): void {
    this.vehicleService.getAllServices().subscribe({
      next: (services) => {
        if (services && Array.isArray(services)) {
          this.allServices = services.map((s: any) => ({
            serviceId: s.serviceId || s.id,
            serviceName: s.serviceName,
            servicePrice: s.servicePrice,
            typeOfVehicle: s.typeOfVehicle
          }));
          this.updatePaginatedItems();
          this.globalErrorMessage = '';
        } else {
          this.globalErrorMessage = 'No services found.';
        }
      },
      error: (_) => {
        this.globalErrorMessage = 'Failed to load services. Please try again later.';
      }
    });
  }
 
  // ---------- Validation helpers ----------
 
  private isPastDate(dateStr: string): boolean {
    return dateStr < this.today;
  }
 
  private isValidLocation(loc: string): boolean {
    const trimmed = loc.trim();
    return trimmed.length > 0 && this.LOCATION_REGEX.test(trimmed);
  }
 
  // ---------- Modal Control ----------
 
  public openBookingModal(service: VehicleMaintenance): void {
    if (!this.currentUser) {
      this.globalErrorMessage = 'You must be logged in to book an appointment.';
      return;
    }
    this.selectedServiceForBooking = service;
    this.showBookingModal = true;
   
    // Reset all modal fields
    this.modalAppointmentDate = '';
    this.modalLocation = '';
    this.modalTimeSlot = '';
    this.modalAvailableSlots = [];
    this.modalIsLoadingSlots = false;
    this.modalErrorMessage = null;
  }
 
  public closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedServiceForBooking = null;
  }
 
 
  public onModalDateChange(): void {
    this.modalAvailableSlots = [];
    this.modalTimeSlot = '';
    this.modalErrorMessage = null;
 
    if (this.isPastDate(this.modalAppointmentDate)) {
      this.modalErrorMessage = 'Past dates are not allowed.';
      return;
    }
 
    if (!this.selectedServiceForBooking || !this.currentUser) return;
 
    const serviceId = this.selectedServiceForBooking.serviceId; // Get selected serviceId
    const userId = this.currentUser.userId;
    const date = this.modalAppointmentDate;
 
    // Check if user already booked this service today
    this.modalIsLoadingSlots = true;
    this.appointmentService.checkUserBooking(userId, serviceId, date).subscribe({
      next: (hasBooked) => {
        if (hasBooked) {
          this.modalErrorMessage = `You have already booked "${this.selectedServiceForBooking!.serviceName}" for this day.`;
          this.modalIsLoadingSlots = false;
        } else {
     
          this.fetchAvailableSlots(date, serviceId);
        }
      },
      error: (err) => {
        console.error('Error checking user booking:', err);
        this.modalErrorMessage = 'Could not verify your existing appointments.';
        this.modalIsLoadingSlots = false;
      }
    });
  }
 
 
  private fetchAvailableSlots(date: string, serviceId: number): void {
 
    this.appointmentService.getAvailableSlots(date, serviceId).subscribe({
      next: (slots) => {
        this.modalAvailableSlots = slots;
        if (slots.length === 0) {
          this.modalErrorMessage = 'Sorry, there are no available slots for this date.';
        }
        this.modalIsLoadingSlots = false;
      },
      error: (err) => {
        console.error('Error fetching slots:', err);
        this.modalErrorMessage = 'Could not load available slots.';
        this.modalIsLoadingSlots = false;
      }
    });
  }
 
  public selectModalSlot(slot: string): void {
    this.modalTimeSlot = slot;
    this.modalErrorMessage = null;
  }
 
 
  // ---------- Form submission  ----------
  public onModalSubmit(form: NgForm): void {
    if (form.invalid) {
      this.modalErrorMessage = 'Please fill in all required fields.';
      return;
    }
    if (!this.modalTimeSlot) {
      this.modalErrorMessage = 'Please select an available time slot.';
      return;
    }
    if (!this.isValidLocation(this.modalLocation)) {
      this.modalErrorMessage = 'Location can contain only letters and spaces.';
      return;
    }
 
    this.modalErrorMessage = null;
 
    const newAppointment: Appointment = {
      service: this.selectedServiceForBooking!,
      appointmentDate: this.modalAppointmentDate,
      timeSlot: this.modalTimeSlot,
      location: this.modalLocation.trim(),
      user: this.currentUser!,
      status: 'Pending',
      bookedServiceName:this.selectedServiceForBooking.serviceName,
      bookedServicePrice:this.selectedServiceForBooking.servicePrice,
      bookedVehicleType:this.selectedServiceForBooking.typeOfVehicle
    };
 
    this.appointmentService.addAppointment(newAppointment).subscribe({
      next: (_) => {
        this.closeBookingModal();
        this.showSuccessPopupWith('Appointment added successfully!');
      },
      error: (err) => {
        console.error('Error response:', err);
        if (err.error && typeof err.error === 'string') {
          this.modalErrorMessage = err.error;
        } else {
          this.modalErrorMessage = 'Failed to book. The slot may have just been taken.';
        }
      }
    });
  }
 
  // ---------- Popup control  ----------
  private showSuccessPopupWith(message: string): void {
    this.successMessage = message;
    this.showSuccessPopup = true;
 
    if (this.popupTimer) clearTimeout(this.popupTimer);
 
    this.popupTimer = setTimeout(() => {
      this.closePopup();
    }, 2000);
  }
 
  public closePopup(): void {
    this.showSuccessPopup = false;
    this.successMessage = '';
    if (this.popupTimer) clearTimeout(this.popupTimer);
    this.popupTimer = null;
    this.router.navigate(['/userviewappointment']);
  }
 
  // ---------- Pagination  ----------
  updatePaginatedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedServices = this.allServices.slice(startIndex, endIndex);
  }
 
  getTotalPages(): number {
    return Math.ceil(this.allServices.length / this.itemsPerPage);
  }
 
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages).fill(0).map((_, i) => i + 1);
  }
 
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedItems();
    }
  }
}