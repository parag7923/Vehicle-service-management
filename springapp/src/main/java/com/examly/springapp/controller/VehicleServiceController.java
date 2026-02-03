package com.examly.springapp.controller;

import com.examly.springapp.model.VehicleMaintenance;
import com.examly.springapp.service.VehicleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
public class VehicleServiceController {

    private VehicleService vehicleService;

    public VehicleServiceController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleMaintenance> addService(@RequestBody VehicleMaintenance service) {
        VehicleMaintenance created = vehicleService.addService(service);
        if (created == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<VehicleMaintenance>> getAllServices() {
        List<VehicleMaintenance> services = vehicleService.getAllServices();
        if (services.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(services);
    }

    @GetMapping("/service")
    public ResponseEntity<List<VehicleMaintenance>> getServiceByName(@RequestParam String serviceName) {
        List<VehicleMaintenance> services = vehicleService.findByServiceName(serviceName);
        if (services.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(services);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleMaintenance> updateService(@PathVariable Long id,
            @RequestBody VehicleMaintenance service) {
        VehicleMaintenance updated = vehicleService.updateService(id, service);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        Optional<VehicleMaintenance> serviceOpt = vehicleService.getServiceById(id);
        if (serviceOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        vehicleService.deleteServiceAndSetAppointmentToNull(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleMaintenance> getServiceById(@PathVariable Long id) {
        Optional<VehicleMaintenance> found = vehicleService.getServiceById(id);
        if (found.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(found.get());
    }
}