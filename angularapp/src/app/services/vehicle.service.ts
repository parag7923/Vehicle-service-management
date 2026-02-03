import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleMaintenance } from '../models/vehicle-maintenance.model';
import { BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  public apiUrl = `${BASE_URL}/api/services`;

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<VehicleMaintenance[]> {
    return this.http.get<VehicleMaintenance[]>(this.apiUrl);
  }

  addService(service: VehicleMaintenance): Observable<any> {
    return this.http.post<any>(this.apiUrl, service);
  }

  updateService(serviceId: number, updatedService: VehicleMaintenance): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${serviceId}`, updatedService);
  }

  deleteService(serviceId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${serviceId}`);
  }
  

  getServiceByName(serviceName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${serviceName}`);
  }
  getServiceById(serviceId: number): Observable<VehicleMaintenance> {
    return this.http.get<VehicleMaintenance>(`${this.apiUrl}/${serviceId}`);
  }
}