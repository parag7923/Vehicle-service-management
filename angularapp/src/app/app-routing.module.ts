import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

// Admin Components
import{ AdminaddserviceComponent } from './components/adminaddservice/adminaddservice.component';
import { AdminviewappointmentComponent } from './components/adminviewappointment/adminviewappointment.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { AdminviewserviceComponent } from './components/adminviewservice/adminviewservice.component';
import { AdminviewuserdetailsComponent } from './components/adminviewuserdetails/adminviewuserdetails.component';

// User Components
import { UseraddappointmentComponent } from './components/useraddappointment/useraddappointment.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewappointmentComponent } from './components/userviewappointment/userviewappointment.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },

  // Admin Routes (Protected)
  { path: 'adminaddservice', component: AdminaddserviceComponent, canActivate: [AdminGuard] },
  { path: 'adminviewappointment', component: AdminviewappointmentComponent, canActivate: [AdminGuard] },
  { path: 'adminviewfeedback', component: AdminviewfeedbackComponent, canActivate: [AdminGuard] },
  { path: 'adminviewservice', component: AdminviewserviceComponent, canActivate: [AdminGuard] },
  { path: 'adminviewuserdetails', component: AdminviewuserdetailsComponent, canActivate: [AdminGuard] },

  // User Routes (Protected)
  { path: 'useraddappointment', component: UseraddappointmentComponent, canActivate: [UserGuard] },
  { path: 'useraddfeedback', component: UseraddfeedbackComponent, canActivate: [UserGuard] },
  { path: 'userviewappointment', component: UserviewappointmentComponent, canActivate: [UserGuard] },
  { path: 'userviewfeedback', component: UserviewfeedbackComponent, canActivate: [UserGuard] },

  { path: 'error', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }