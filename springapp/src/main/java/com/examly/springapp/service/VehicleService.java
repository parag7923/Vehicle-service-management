package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import com.examly.springapp.model.VehicleMaintenance;

public interface VehicleService {

    VehicleMaintenance addService(VehicleMaintenance service);

    VehicleMaintenance updateService(Long id, VehicleMaintenance service);

    //void deleteService(Long id);

    List<VehicleMaintenance> getAllServices();

    Optional<VehicleMaintenance> getServiceById(Long id);

    List<VehicleMaintenance> findByServiceName(String serviceName);

    void deleteServiceAndSetAppointmentToNull(long serviceId);

}
