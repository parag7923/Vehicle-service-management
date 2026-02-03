import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-adminaddservice',
  templateUrl: './adminaddservice.component.html',
  styleUrls: ['./adminaddservice.component.css']
})
export class AdminaddserviceComponent implements OnInit {
  public service: VehicleMaintenance = {
    serviceId: 0,
    serviceName: '',
    servicePrice: null,
    typeOfVehicle: ''
  };

  public vehicleTypes: string[] = ['Two-Wheeler', 'Three-Wheeler', 'Four-Wheeler', 'Other'];
  public showSuccessPopup = false;
  public isEditMode = false;

  @ViewChild('serviceForm') public serviceForm!: NgForm;

  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const serviceIdParam = this.route.snapshot.paramMap.get('id');
    if (serviceIdParam) {
      const serviceId = +serviceIdParam;
      this.isEditMode = true;

      this.vehicleService.getServiceById(serviceId).subscribe({
        next: (data: any) => {
          this.service = {
            serviceId: data.id, 
            serviceName: data.serviceName,
            servicePrice: data.servicePrice,
            typeOfVehicle: data.typeOfVehicle
          };
        },
        error: (err) => {
          console.error('Error fetching service by ID:', err);
        }
      });
    }
  }

  public onSubmit(): void {
    if (this.serviceForm.valid) {
      if (this.isEditMode) {
        
        this.vehicleService.updateService(this.service.serviceId, this.service).subscribe({
          next: () => {
            alert('Service updated successfully!');
            this.router.navigate(['/adminviewservice']);
          },
          error: (err) => {
            console.error('Error updating service:', err);
          }
        });
      } else {
        
        this.vehicleService.addService(this.service).subscribe({
          next: () => {
            this.showSuccessPopup = true; 
          },
          error: (err) => {
            console.error('Error adding service:', err);
          }
        });
      }
    }
  }

  public closePopup(): void {
    this.showSuccessPopup = false;
    this.serviceForm.resetForm({
      serviceName: '',
      servicePrice: null,
      typeOfVehicle: ''
    });
    this.router.navigate(['/adminviewservice']); 
  }
}
