
import { Appointment } from "./appointment.model";
import { VehicleMaintenance } from "./vehicle-maintenance.model";

describe('AppointmentModel', () => {

  fit('frontend_Appointment_model_should_create_an_instance', () => {
    const mockService: VehicleMaintenance = {
      serviceId: 1,
      serviceName: 'Oil Change',
      servicePrice: 300,
      typeOfVehicle: 'Car',
    };

    const appointment: Appointment = {
      appointmentId: 1,
      service: mockService,
      appointmentDate: '2025-01-10T10:00:00Z',
      location: 'Garage 1',
      status: 'Pending',
      user: { userId: 101 },
    };

    expect(appointment).toBeDefined();
    expect(appointment.appointmentId).toBeDefined();
    expect(appointment.service).toBeDefined();
    expect(appointment.appointmentDate).toBeDefined();
    expect(appointment.location).toBeDefined();
    expect(appointment.status).toBeDefined();
  });

});
