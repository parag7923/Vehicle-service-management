package com.examly.springapp.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @ManyToOne
    @JoinColumn(name = "serviceId")
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private VehicleMaintenance service;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;

    private String location;

    private String timeSlot;
    
    private String status;

    //----new fields
    private String bookedServiceName;
    private int bookedServicePrice;
    private String bookedVehicleType;
    
    



    @ManyToOne
    @JoinColumn(name = "userId")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    public Appointment() {}
    
    public Appointment(VehicleMaintenance service, LocalDate appointmentDate, String location, User user, String status,String timeSlot) {
        this.service = service;
        this.appointmentDate = appointmentDate;
        this.location = location;
        this.status = status;
        this.user = user;
        this.timeSlot=timeSlot;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public VehicleMaintenance getService() {
        return service;
    }

    public void setService(VehicleMaintenance service) {
        this.service = service;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }



    public String getTimeSlot() {
        return timeSlot;
    }



    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public String getBookedServiceName() {
        return bookedServiceName;
    }

    public void setBookedServiceName(String bookedServiceName) {
        this.bookedServiceName = bookedServiceName;
    }

    public int getBookedServicePrice() {
        return bookedServicePrice;
    }

    public void setBookedServicePrice(int bookedServicePrice) {
        this.bookedServicePrice = bookedServicePrice;
    }

    public String getBookedVehicleType() {
        return bookedVehicleType;
    }

    public void setBookedVehicleType(String bookedVehicleType) {
        this.bookedVehicleType = bookedVehicleType;
    }
}
