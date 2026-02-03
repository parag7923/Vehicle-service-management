
import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminviewservice',
  templateUrl: './adminviewservice.component.html',
  styleUrls: ['./adminviewservice.component.css']
})
export class AdminviewserviceComponent implements OnInit {
  services: VehicleMaintenance[] = [];
  displayedServices: VehicleMaintenance[] = [];
  paginatedServices: VehicleMaintenance[] = [];

  searchQuery: string = '';
  isLoading: boolean = true;
  showSearchClear: boolean = false;

  vehicleTypes: string[] = ['Two-Wheeler', 'Three-Wheeler', 'Four-Wheeler', 'Other'];

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  showEditModal: boolean = false;
  showDeleteConfirm: boolean = false;
  showSuccessPopup: boolean = false;
  successMessage: string = '';
  serviceToEdit: VehicleMaintenance | null = null;
  serviceToDelete: VehicleMaintenance | null = null;

  constructor(private vehicleService: VehicleService, private router: Router) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.vehicleService.getAllServices().subscribe({
      next: (data) => {
        this.services = data.map((s: any) => ({
          serviceId: s.id,
          serviceName: s.serviceName,
          servicePrice: s.servicePrice,
          typeOfVehicle: s.typeOfVehicle
        }));
        this.displayedServices = [...this.services];
        this.setupPagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load services:', error);
        this.isLoading = false;
      }
    });
  }

  searchServices(): void {
    const query = this.searchQuery.trim().toLowerCase();
  
    if (!query) {
      // Reset to full list when search is cleared
      this.displayedServices = [...this.services];
      this.showSearchClear = false;
      this.setupPagination();
      return;
    }
  
    this.showSearchClear = true;
    this.displayedServices = this.services.filter(service =>
      service.serviceName.toLowerCase().includes(query)
    );
    this.setupPagination();
  }

  // showAll(): void {
  //   this.searchQuery = '';
  //   this.showSearchClear = false;
  //   this.displayedServices = [...this.services];
  //   this.setupPagination();
  // }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.displayedServices.length / this.pageSize);
    this.totalPagesArray = Array(this.totalPages).fill(0).map((_, i) => i + 1);
    this.paginate();
  }

  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedServices = this.displayedServices.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  openEditModal(service: VehicleMaintenance): void {
    this.serviceToEdit = { ...service };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.serviceToEdit = null;
  }

  onUpdateService(): void {
    if (this.serviceToEdit && this.serviceToEdit.serviceId) {
      this.vehicleService.updateService(this.serviceToEdit.serviceId, this.serviceToEdit).subscribe({
        next: () => {
          this.closeEditModal();
          this.showSuccessPopup = true;
          this.successMessage = 'Service updated successfully!';
          this.loadServices();
        },
        error: (err) => {
          console.error('Error updating service:', err);
        }
      });
    }
  }

  openDeleteConfirm(service: VehicleMaintenance): void {
    this.serviceToDelete = service;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.serviceToDelete = null;
    this.showDeleteConfirm = false;
  }

  confirmDelete(): void {
    if (this.serviceToDelete && this.serviceToDelete.serviceId) {
      this.vehicleService.deleteService(this.serviceToDelete.serviceId).subscribe({
        next: () => {
          this.closeDeleteConfirm();
          this.showSuccessPopup = true;
          this.successMessage = 'Service deleted successfully!';
          this.loadServices();
        },
        error: (err) => {
          console.error('Error deleting service:', err);
          this.closeDeleteConfirm();
        }
      });
    }
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.successMessage = '';
  }

  editService(service: VehicleMaintenance): void {
    this.router.navigate(['/admin/editservice', service.serviceId]);
  }
}
