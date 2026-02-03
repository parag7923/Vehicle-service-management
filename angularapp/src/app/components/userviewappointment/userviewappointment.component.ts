import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-userviewappointment',
  templateUrl: './userviewappointment.component.html',
  styleUrls: ['./userviewappointment.component.css']
})
export class UserviewappointmentComponent implements OnInit {

  allMyAppointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  paginatedAppointments: Appointment[] = [];

  errorMessage: string = '';
  successMessage: string = '';
  currentUserId: number = 0;


  selectedStatus: string = 'All';
  statuses: string[] = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

  isLoading: boolean = true;

  public searchTerm:string='';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  // Popups
  showSuccessPopup: boolean = false;
  showErrorPopup: boolean = false;

  // --- Edit Modal State ---
  showEditModal: boolean = false;
  currentEditingAppointment: Appointment | null = null;

  editFormData: { appointmentDate: string, location: string, timeSlot: string } = {
    appointmentDate: '',
    location: '',
    timeSlot: ''
  };

  editAvailableSlots: string[] = [];
  editIsLoadingSlots: boolean = false;
  editErrorMessage: string | null = null;

  today: string = '';
  private readonly LOCATION_REGEX = /^[A-Za-z ]+$/;

  // Cancel Confirmation
  showCancelConfirm: boolean = false;
  appointmentToCancel: Appointment | null = null;
  isProcessing: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];

    this.currentUserId = this.authService.getAuthenticatedUserId();
    if (this.currentUserId) {
      this.loadAppointmentsForUser(this.currentUserId);
    } else {
      this.showError('User not logged in.');
    }
  }

  loadAppointmentsForUser(userId: number): void {
    this.isLoading = true;
    this.appointmentService.getAppointmentsByUser(userId).subscribe({
      next: (data) => {
        //mapping the id to serviceId
        data.forEach(app => {
          if (app.service && app.service.id) {
            app.service.serviceId = app.service.id;
          }
        });

        this.allMyAppointments = data.sort((a, b) =>
          (b.appointmentId ?? 0) - (a.appointmentId ?? 0)
        );

        this.onFilterChange();
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Failed to load your appointments. Please try again.');
        console.error('Error fetching appointments:', error);
        this.isLoading = false;
      }
    });
  }


  onFilterChange(): void {
    let tempAppointments = [...this.allMyAppointments];
 
    // Apply Status Filter
    if (this.selectedStatus !== 'All') {
      tempAppointments = tempAppointments.filter(
        app => app.status === this.selectedStatus
      );
    }
 
    // Apply Search Filter
    if (this.searchTerm.trim() !== '') {
      const lowerTerm = this.searchTerm.toLowerCase();
 
      tempAppointments = tempAppointments.filter(app => {
        // Use snapshot data for searching
        const serviceName = app.bookedServiceName ? app.bookedServiceName.toLowerCase() : '';
        const location = app.location ? app.location.toLowerCase() : '';
        const status = app.status ? app.status.toLowerCase() : '';
        const timeSlot = app.timeSlot ? app.timeSlot.toLowerCase() : '';
 
        return serviceName.includes(lowerTerm) ||
               location.includes(lowerTerm) ||
               status.includes(lowerTerm) ||
               timeSlot.includes(lowerTerm);
      });
    }
 
    this.filteredAppointments = tempAppointments;
    this.currentPage = 1;
    this.setupPagination();
  }


  setupPagination(): void {
    this.totalPages = Math.ceil(this.filteredAppointments.length / this.pageSize);
    this.totalPagesArray = Array(this.totalPages).fill(0).map((_, i) => i + 1);
    this.paginate();
  }
  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAppointments = this.filteredAppointments.slice(startIndex, endIndex);
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }



  // --- EDIT METHODS ---
  openEditModal(appointment: Appointment): void {
    if (appointment.status !== 'Pending') return;

    this.currentEditingAppointment = appointment;

    this.editFormData = {
      appointmentDate: appointment.appointmentDate,
      location: appointment.location,
      timeSlot: appointment.timeSlot
    };

    this.showEditModal = true;
    this.closeErrorPopup();



  
    if (appointment.service && appointment.service.serviceId) {
      // If data is present, fetch slots
      this.fetchEditSlots(appointment.appointmentDate, appointment.service.serviceId);
    } else {
      // If service or serviceId is null, show the error.
      console.error("Incomplete data: Appointment is missing service.serviceId", appointment);
      this.editErrorMessage = "Service data is missing for this appointment. Cannot load slots.";
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentEditingAppointment = null;
    this.editFormData = { appointmentDate: '', location: '', timeSlot: '' };
    this.editAvailableSlots = [];
    this.editIsLoadingSlots = false;
    this.editErrorMessage = null;
    this.isProcessing = false;
  }

  onEditDateChange(): void {
    this.editFormData.timeSlot = '';
    this.editAvailableSlots = [];
    this.editErrorMessage = null;

    if (this.isPastDate(this.editFormData.appointmentDate)) {
      this.editErrorMessage = 'Past dates are not allowed.';
      return;
    }

    if (!this.currentEditingAppointment || !this.currentEditingAppointment.service || !this.currentEditingAppointment.service.serviceId) {
      this.editErrorMessage = "Error: Could not find current service to fetch slots.";
      return;
    }

    const serviceId = this.currentEditingAppointment.service.serviceId;
    this.fetchEditSlots(this.editFormData.appointmentDate, serviceId);
  }

  private fetchEditSlots(date: string, serviceId: number): void {
    this.editIsLoadingSlots = true;
    this.appointmentService.getAvailableSlots(date, serviceId).subscribe({
      next: (slots) => {
        this.editAvailableSlots = slots;
        if (slots.length === 0) {
          this.editErrorMessage = 'Sorry, there are no available slots for this date.';
        }
        this.editIsLoadingSlots = false;
      },
      error: (err) => {
        console.error('Error fetching slots for edit modal:', err);
        this.editErrorMessage = 'Could not load available slots.';
        this.editIsLoadingSlots = false;
      }
    });
  }

  public selectEditSlot(slot: string): void {
    this.editFormData.timeSlot = slot;
    this.editErrorMessage = null;
  }

  onUpdateAppointment(form: NgForm): void {
    this.editErrorMessage = null;

    if (form.invalid || !this.currentEditingAppointment) {
      this.editErrorMessage = 'Please fill all fields correctly.';
      return;
    }
    if (this.isPastDate(this.editFormData.appointmentDate)) {
      this.editErrorMessage = 'Please select today or a future date.';
      return;
    }
    if (!this.isValidLocation(this.editFormData.location)) {
      this.editErrorMessage = 'Location can contain only letters and spaces.';
      return;
    }
    if (!this.editFormData.timeSlot) {
      this.editErrorMessage = 'Please select an available time slot.';
      return;
    }

    this.isProcessing = true;

    const partialUpdate = {
      appointmentDate: this.editFormData.appointmentDate,
      location: this.editFormData.location.trim(),
      timeSlot: this.editFormData.timeSlot
    };

    this.appointmentService.updateAppointment(this.currentEditingAppointment!.appointmentId!, partialUpdate as Appointment).subscribe({
      next: (response) => {
        const index = this.allMyAppointments.findIndex(
          app => app.appointmentId === this.currentEditingAppointment!.appointmentId
        );
        if (index !== -1) {
          this.allMyAppointments[index] = response;
        }

        this.onFilterChange();
        this.showSuccess('Appointment updated successfully!');
        this.closeEditModal();
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error updating appointment:', error);
        this.editErrorMessage = error.error?.message || 'Failed to update appointment. The slot may have been taken.';
        this.isProcessing = false;
      }
    });
  }
  // --- CANCEL METHODS ---
  openCancelConfirm(appointment: Appointment): void {
    if (appointment.status === 'Rejected' || appointment.status === 'Cancelled') return;
    this.appointmentToCancel = appointment;
    this.showCancelConfirm = true;
  }
  closeCancelConfirm(): void {
    this.showCancelConfirm = false;
    this.appointmentToCancel = null;
  }
  confirmCancel(): void {
    if (!this.appointmentToCancel) return;
    this.isProcessing = true;

    this.appointmentService.updateAppointmentStatus(this.appointmentToCancel.appointmentId!, 'Cancelled').subscribe({
      next: (response) => {
        const index = this.allMyAppointments.findIndex(
          app => app.appointmentId === this.appointmentToCancel!.appointmentId
        );
        if (index !== -1) {
          this.allMyAppointments[index] = response;
        }

        this.onFilterChange();
        this.showSuccess('Appointment cancelled successfully!');
        this.closeCancelConfirm();
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error cancelling appointment:', error);
        this.showError(error.error?.message || 'Failed to cancel appointment. Please try again.');
        this.closeCancelConfirm();
        this.isProcessing = false;
      }
    });
  }
  // --- VALIDATION HELPERS ---
  private isPastDate(dateStr: string | undefined | null): boolean {
    if (!dateStr) return true;
    return dateStr < this.today;
  }
  private isValidLocation(loc: string | undefined | null): boolean {
    if (!loc) return false;
    const trimmed = loc.trim();
    return trimmed.length > 0 && this.LOCATION_REGEX.test(trimmed);
  }
  // --- POPUP HANDLERS ---
  showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessPopup = true;
    setTimeout(() => this.closeSuccessPopup(), 3000);
  }
  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorPopup = true;
  }
  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.successMessage = '';
  }
  closeErrorPopup(): void {
    this.showErrorPopup = false;
    this.errorMessage = '';
  }
}
