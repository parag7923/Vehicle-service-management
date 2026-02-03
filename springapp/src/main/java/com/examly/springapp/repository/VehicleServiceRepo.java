package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.VehicleMaintenance;

public interface VehicleServiceRepo extends JpaRepository<VehicleMaintenance , Long>{

    List<VehicleMaintenance> findByServiceName(String serviceName);
    
} 
