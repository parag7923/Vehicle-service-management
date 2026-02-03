import { VehicleMaintenance } from "./vehicle-maintenance.model";

describe('VehicleMaintenanceModel', () => {

  fit('frontend_VehicleMaintenance_model_should_create_an_instance', () => {
    const vehicleService: VehicleMaintenance = {
    serviceId: 1,
      serviceName: 'Oil Change',
      servicePrice: 300,
      typeOfVehicle: 'Car',
    };

    expect(vehicleService).toBeDefined();
    expect(vehicleService.serviceName).toBeDefined();
    expect(vehicleService.servicePrice).toBeDefined();
    expect(vehicleService.typeOfVehicle).toBeDefined();
  });
  
});
