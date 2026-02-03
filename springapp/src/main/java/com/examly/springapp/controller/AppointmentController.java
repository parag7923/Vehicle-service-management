package com.examly.springapp.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException; // Import
import com.examly.springapp.model.Appointment;
import com.examly.springapp.service.AppointmentService;

import java.time.LocalDate;
import java.util.*;
@RestController
// ---  Fixed URL to match frontend (plural) ---
@RequestMapping("/api/appointment")
public class AppointmentController {
    private AppointmentService appointmentService;
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }
    // --- Exception handler for 409 Conflict (Slot taken) ---
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex) {
        // Returns 409 Conflict status with the error message
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
    // ---  Exception handler for 403 Forbidden ---
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDenied(AccessDeniedException ex) {
        // Returns 403 Forbidden status
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }
    // --- ENDPOINT FOR getAvailableSlots ---
    @GetMapping("/available-slots")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<String>> getAvailableSlots(
            @RequestParam LocalDate date,
            @RequestParam Long serviceId) {
        
        List<String> slots = appointmentService.getAvailableSlots(date, serviceId);
        return ResponseEntity.ok(slots);
    }
    // --- ENDPOINT FOR checkUserBooking ---
    @GetMapping("/check-booking")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Boolean> checkUserBooking(
            @RequestParam Long userId,
            @RequestParam Long serviceId,
            @RequestParam LocalDate date) {
        
        boolean hasBooked = appointmentService.checkUserBooking(userId, serviceId, date);
        return ResponseEntity.ok(hasBooked);
    }
    // --- MODIFIED: Simplified addAppointment (using new handlers) ---
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Appointment> addAppointment(@RequestBody Appointment appointment) {
        // The service will now throw an exception if the slot is taken
        // or if user/service is not found, which will be caught by handlers.
        Appointment savedAppointment = appointmentService.addAppointment(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAppointment);
    }
    // ---  Changed path to be /user/{userId} for clarity ---
    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getAppointmentsByUserId(@PathVariable Long userId) {
        
        List<Appointment> appointments = appointmentService.getAppointmentsByUserId(userId);
        return ResponseEntity.ok(appointments);
    }
    // --- getAllAppointments (No changes) ---
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }
    
    // --- Simplified updateAppointment (using new handlers) ---
    @PutMapping("/{appointmentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long appointmentId,
            @RequestBody Appointment appointment) {
        
       
        Appointment updatedAppointment = appointmentService.updateAppointment(appointmentId, appointment);
        return ResponseEntity.ok(updatedAppointment);
    }
   
  
    @PutMapping("/{appointmentId}/status") 
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok(updatedAppointment);
    }
   
    @DeleteMapping("/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long appointmentId) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(appointmentId);
        if (appointment.isPresent()) {
            appointmentService.deleteAppointment(appointmentId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}