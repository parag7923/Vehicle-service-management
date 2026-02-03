package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examly.springapp.model.Appointment;
import com.examly.springapp.model.VehicleMaintenance;
import com.examly.springapp.repository.AppointmentRepo;
import com.examly.springapp.repository.VehicleServiceRepo;


@Service
public class VehicleServiceImpl implements VehicleService{

    private VehicleServiceRepo vehicleServiceRepo;
    private AppointmentRepo appointmentRepo;
    
    public VehicleServiceImpl(VehicleServiceRepo vehicleServiceRepo, AppointmentRepo appointmentRepo) {
        this.vehicleServiceRepo = vehicleServiceRepo;
        this.appointmentRepo = appointmentRepo;
    }

    @Override
    public VehicleMaintenance addService(VehicleMaintenance service) {
       return vehicleServiceRepo.save(service);
    }
    
    // @Transactional
    // @Override
    // public void deleteService(Long serviceId) {
    //     // Delete all appointments linked to this service
    //     appointmentRepo.deleteByServiceId(serviceId);
    
    //     // Delete the service itself
    //     VehicleMaintenance found = vehicleServiceRepo.findById(serviceId).orElse(null);
    //     if (found != null) {
    //         vehicleServiceRepo.delete(found);
    //     }
    // }


    @Override
    public List<VehicleMaintenance> getAllServices() {
        return vehicleServiceRepo.findAll();
    }

    @Override
    public Optional<VehicleMaintenance> getServiceById(Long serviceId) {
        return vehicleServiceRepo.findById(serviceId);
    }
 
    @Override
    public VehicleMaintenance updateService(Long serviceId , VehicleMaintenance service) {
        VehicleMaintenance found=vehicleServiceRepo.findById(serviceId).orElse(null);
        if(found!=null)
        {           
            found.setServiceName(service.getServiceName());
            found.setServicePrice(service.getServicePrice());
            found.setTypeOfVehicle(service.getTypeOfVehicle());
            return vehicleServiceRepo.save(found);
        }
        return null;
    }

    
    @Override
    public List<VehicleMaintenance> findByServiceName(String serviceName) {
        return vehicleServiceRepo.findByServiceName(serviceName);
    }

    @Override
    public void deleteServiceAndSetAppointmentToNull(long serviceId) {
       List<Appointment> appointmentsToUpdate =appointmentRepo.findByServiceServiceId(serviceId);
       //loop and set service link to null
       for(Appointment app:appointmentsToUpdate){
        app.setService(null);
       }
       //save updated appointment to break tha link
       appointmentRepo.saveAll(appointmentsToUpdate);

       vehicleServiceRepo.deleteById(serviceId);
    }

}
