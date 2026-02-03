package com.examly.springapp.repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.examly.springapp.model.Appointment;

@Repository
public interface AppointmentRepo extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserUserId(Long userId);

    List<Appointment> findByServiceServiceId(long serviceId);

    
    @Modifying
    @Transactional //insure all happens in one transaction
    @Query("DELETE FROM Appointment a WHERE a.service.serviceId = :serviceId")
    void deleteByServiceId(@Param("serviceId") Long serviceId);


    @Query("SELECT a.timeSlot FROM Appointment a WHERE a.service.serviceId = :serviceId AND a.appointmentDate = :date AND a.status NOT IN ('Cancelled', 'Rejected')")
    List<String> findBookedTimeSlotsByServiceIdAndDate(@Param("serviceId") Long serviceId,
            @Param("date") LocalDate date);


    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.user.userId = :userId AND a.service.serviceId = :serviceId AND a.appointmentDate = :date AND a.status NOT IN ('Cancelled', 'Rejected')")
    boolean existsByUserAndServiceAndDate(@Param("userId") Long userId, @Param("serviceId") Long serviceId,
            @Param("date") LocalDate date);


    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.service.serviceId = :serviceId AND a.appointmentDate = :date AND a.timeSlot = :timeSlot AND a.status NOT IN ('Cancelled', 'Rejected')")
    boolean existsByServiceIdAndDateAndTimeSlot(@Param("serviceId") Long serviceId, @Param("date") LocalDate date,
            @Param("timeSlot") String timeSlot);
            

    @Query("SELECT a FROM Appointment a WHERE a.service.serviceId = :serviceId AND a.appointmentDate = :date AND a.timeSlot = :timeSlot AND a.appointmentId != :excludeAppointmentId AND a.status NOT IN ('Cancelled', 'Rejected')")
    Optional<Appointment> findClashingAppointment(@Param("serviceId") Long serviceId, @Param("date") LocalDate date,
            @Param("timeSlot") String timeSlot, @Param("excludeAppointmentId") Long excludeAppointmentId);
}