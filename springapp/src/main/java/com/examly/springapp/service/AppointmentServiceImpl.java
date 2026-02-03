package com.examly.springapp.service;
import com.examly.springapp.model.Appointment;
import com.examly.springapp.model.User;
import com.examly.springapp.model.VehicleMaintenance;
import com.examly.springapp.repository.AppointmentRepo;
import com.examly.springapp.repository.UserRepo;
import com.examly.springapp.repository.VehicleServiceRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;
@Service
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepo appointmentRepo;
    private final UserRepo userRepo;
    private final VehicleServiceRepo vehicleServiceRepo;
    private static final List<String> ALL_AVAILABLE_SLOTS = Arrays.asList(
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    );
    public AppointmentServiceImpl(AppointmentRepo appointmentRepo, UserRepo userRepo,
                                   VehicleServiceRepo vehicleServiceRepo) {
        this.appointmentRepo = appointmentRepo;
        this.userRepo = userRepo;
        this.vehicleServiceRepo = vehicleServiceRepo;
    }
    @Override
    public List<String> getAvailableSlots(LocalDate date, Long serviceId) {
        List<String> bookedSlots = appointmentRepo.findBookedTimeSlotsByServiceIdAndDate(serviceId, date);
        List<String> availableSlots = new ArrayList<>(ALL_AVAILABLE_SLOTS);
        availableSlots.removeAll(bookedSlots);
        return availableSlots;
    }
    @Override
    public boolean checkUserBooking(Long userId, Long serviceId, LocalDate date) {
        return appointmentRepo.existsByUserAndServiceAndDate(userId, serviceId, date);
    }
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User is not authenticated");
        }
        String currentUsername = authentication.getName();
        User user = userRepo.findByUsername(currentUsername);
        if (user == null) {
            throw new jakarta.persistence.EntityNotFoundException("User not found: " + currentUsername);
        }
        return user;
    }
    private Appointment findAppointmentById(Long appointmentId) {
         return appointmentRepo.findById(appointmentId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Appointment not found: " + appointmentId));
    }
    @Override
    public Appointment addAppointment(Appointment appointment) {
        User currentUser = getAuthenticatedUser();
        appointment.setUser(currentUser);
        Long serviceId = appointment.getService().getServiceId();
        VehicleMaintenance service = vehicleServiceRepo.findById(serviceId).orElseThrow(() ->
            new IllegalArgumentException("Service not found in DB"));
        appointment.setService(service);
        boolean slotTaken = appointmentRepo.existsByServiceIdAndDateAndTimeSlot(
            serviceId,
            appointment.getAppointmentDate(),
            appointment.getTimeSlot()
        );
        if (slotTaken) {
            throw new IllegalStateException("This time slot is no longer available. Please select another slot.");
        }
        appointment.setStatus("Pending");
        return appointmentRepo.save(appointment);
    }
    @Override
    public void deleteAppointment(Long appointmentId) {
        appointmentRepo.deleteById(appointmentId);
    }
    
    @Override
    public Optional<Appointment> getAppointmentById(Long appointmentId) {
        return appointmentRepo.findById(appointmentId);
    }
    // --- *** HERE IS THE FIX *** ---
    @Override
    public List<Appointment> getAllAppointments() {
        // 1. Get the data
        List<Appointment> data = appointmentRepo.findAll();
        
        // 2. FORCE Hibernate to load the service data
        data.forEach(a -> {
            if (a.getService() != null) {
                a.getService().getServiceName(); // This line forces the load
            }
        });
        
        // 3. Return the fully loaded data
        return data;
    }
    // --- *** HERE IS THE FIX *** ---
    @Override
    public List<Appointment> getAppointmentsByUserId(Long userId) {
        // 1. Get the data using the CORRECT method name
        List<Appointment> data = appointmentRepo.findByUserUserId(userId);
        
        // 2. FORCE Hibernate to load the service data
        data.forEach(a -> {
            if (a.getService() != null) {
                a.getService().getServiceName(); // This line forces the load
            }
        });
        
        // 3. Return the fully loaded data
        return data;
    }
    @Override
    public Appointment updateAppointment(Long appointmentId, Appointment updateRequest) {
        User currentUser = getAuthenticatedUser();
        Appointment existingAppointment = findAppointmentById(appointmentId);
        boolean isAdmin = "ADMIN".equals(currentUser.getUserRole());
        if (!isAdmin && !Objects.equals(existingAppointment.getUser().getUserId(), currentUser.getUserId())) {
            throw new AccessDeniedException("You are not authorized to update this appointment.");
        }
        if (!isAdmin && !"Pending".equalsIgnoreCase(existingAppointment.getStatus())) {
            throw new IllegalStateException("Only 'Pending' appointments can be edited.");
        }
        
        LocalDate oldDate = existingAppointment.getAppointmentDate();
        String oldSlot = existingAppointment.getTimeSlot();
        boolean dateOrSlotChanged = false;
        if (updateRequest.getAppointmentDate() != null && !updateRequest.getAppointmentDate().equals(oldDate)) {
            existingAppointment.setAppointmentDate(updateRequest.getAppointmentDate());
            dateOrSlotChanged = true;
        }
        if (updateRequest.getLocation() != null) {
            existingAppointment.setLocation(updateRequest.getLocation());
        }
        if (updateRequest.getTimeSlot() != null && !updateRequest.getTimeSlot().equals(oldSlot)) {
            existingAppointment.setTimeSlot(updateRequest.getTimeSlot());
            dateOrSlotChanged = true;
        }
        if (dateOrSlotChanged) {
            Long serviceId = existingAppointment.getService().getServiceId();
            
            Optional<Appointment> clash = appointmentRepo.findClashingAppointment(
                serviceId,
                existingAppointment.getAppointmentDate(),
                existingAppointment.getTimeSlot(),
                existingAppointment.getAppointmentId()
            );
            
            if (clash.isPresent()) {
                throw new IllegalStateException("This time slot is no longer available. Please select another slot.");
            }
        }
        if (isAdmin) {
            if (updateRequest.getService() != null) {
                existingAppointment.setService(updateRequest.getService());
            }
            if (updateRequest.getStatus() != null) {
                existingAppointment.setStatus(updateRequest.getStatus());
            }
            if (updateRequest.getUser() != null) {
                existingAppointment.setUser(updateRequest.getUser());
            }
        }
        return appointmentRepo.save(existingAppointment);
    }
    @Override
    public Appointment updateAppointmentStatus(Long appointmentId, String status) {
        User currentUser = getAuthenticatedUser();
        Appointment appointment = findAppointmentById(appointmentId);
        boolean isAdmin = "ADMIN".equals(currentUser.getUserRole());
        
        if (!isAdmin && !Objects.equals(appointment.getUser().getUserId(), currentUser.getUserId())) {
            throw new AccessDeniedException("You are not authorized to update this appointment.");
        }
        if (isAdmin) {
            appointment.setStatus(status);
        } else {
            if (!"Cancelled".equalsIgnoreCase(status)) {
                throw new AccessDeniedException("You are only authorized to 'Cancel' this appointment.");
            }
            if (!"Pending".equalsIgnoreCase(appointment.getStatus()) && !"Approved".equalsIgnoreCase(appointment.getStatus())) {
                 throw new IllegalStateException("Only 'Pending' or 'Approved' appointments can be cancelled.");
            }
            appointment.setStatus(status);
        }
        return appointmentRepo.save(appointment);
    }
}