import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminaddserviceComponent } from './components/adminaddservice/adminaddservice.component';
import { AdminnavbarComponent } from './components/adminnavbar/adminnavbar.component';
import { AdminviewappointmentComponent } from './components/adminviewappointment/adminviewappointment.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { AdminviewserviceComponent } from './components/adminviewservice/adminviewservice.component';
import { AdminviewuserdetailsComponent } from './components/adminviewuserdetails/adminviewuserdetails.component';
import { AuthguardComponent } from './components/authguard/authguard.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UseraddappointmentComponent } from './components/useraddappointment/useraddappointment.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UsernavbarComponent } from './components/usernavbar/usernavbar.component';
import { UserviewappointmentComponent } from './components/userviewappointment/userviewappointment.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminaddserviceComponent,
    AdminnavbarComponent,
    AdminviewappointmentComponent,
    AdminviewfeedbackComponent,
    AdminviewserviceComponent,
    AdminviewuserdetailsComponent,
    AuthguardComponent,
    ErrorComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    ProfileComponent,
    RegistrationComponent,
    UseraddappointmentComponent,
    UseraddfeedbackComponent,
    UsernavbarComponent,
    UserviewappointmentComponent,
    UserviewfeedbackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
