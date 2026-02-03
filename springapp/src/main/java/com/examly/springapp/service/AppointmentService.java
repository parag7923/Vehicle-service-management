package com.examly.springapp.service;
import com.examly.springapp.model.Appointment;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
public interface AppointmentService {
    // --- NEW: Added for frontend ---
    List<String> getAvailableSlots(LocalDate date, Long serviceId);
    // --- NEW: Added for frontend ---
    boolean checkUserBooking(Long userId, Long serviceId, LocalDate date);
    Appointment addAppointment(Appointment appointment);
    void deleteAppointment(Long appointmentId);
    Optional<Appointment> getAppointmentById(Long appointmentId);
    List<Appointment> getAllAppointments();
    List<Appointment> getAppointmentsByUserId(Long userId);
    Appointment updateAppointment(Long appointmentId, Appointment appointment);
    Appointment updateAppointmentStatus(Long appointmentId, String status);
}