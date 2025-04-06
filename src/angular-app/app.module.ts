import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login.component';
import { SignupComponent } from './components/auth/signup.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password.component';
import { AuthService } from './src/app/services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: '', redirectTo: '/login', pathMatch: 'full' }
    ])
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { } 