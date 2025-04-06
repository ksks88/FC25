import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="auth-container fade-in">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your email to receive reset instructions</p>
        </div>
        
        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label for="email" class="form-label">Email address</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                class="form-control"
                id="email"
                formControlName="email"
                placeholder="Enter your email"
                [class.is-invalid]="email?.invalid && email?.touched"
              >
            </div>
            <div class="invalid-feedback" *ngIf="email?.invalid && email?.touched">
              <span *ngIf="email?.errors?.['required']">Email is required</span>
              <span *ngIf="email?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="alert alert-success" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="d-grid gap-2">
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="forgotPasswordForm.invalid || isLoading"
            >
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Sending...' : 'Send Reset Instructions' }}
            </button>
          </div>

          <div class="auth-links">
            <a routerLink="/login">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() { return this.forgotPasswordForm.get('email'); }

  onSubmit() {
    console.log('Form submitted, valid:', this.forgotPasswordForm.valid);
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const { email } = this.forgotPasswordForm.value;
      console.log('Sending password reset request to API');
      
      this.authService.resetPassword(email).subscribe({
        next: (response) => {
          console.log('Password reset request successful:', response);
          this.successMessage = 'Password reset instructions have been sent to your email.';
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Password reset request failed:', error);
          this.errorMessage = error.error?.message || 'Password reset request failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
} 