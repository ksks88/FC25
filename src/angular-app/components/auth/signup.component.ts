import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  template: `
    <div class="auth-container fade-in">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Create Account</h2>
          <p>Join us and start your journey</p>
        </div>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
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

          <div class="mb-4">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-lock"></i>
              </span>
              <input
                type="password"
                class="form-control"
                id="password"
                formControlName="password"
                placeholder="Create a password"
                [class.is-invalid]="password?.invalid && password?.touched"
              >
            </div>
            <div class="invalid-feedback" *ngIf="password?.invalid && password?.touched">
              <span *ngIf="password?.errors?.['required']">Password is required</span>
              <span *ngIf="password?.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <div class="mb-4">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                formControlName="confirmPassword"
                placeholder="Confirm your password"
                [class.is-invalid]="confirmPassword?.invalid && confirmPassword?.touched"
              >
            </div>
            <div class="invalid-feedback" *ngIf="confirmPassword?.invalid && confirmPassword?.touched">
              <span *ngIf="confirmPassword?.errors?.['required']">Please confirm your password</span>
              <span *ngIf="confirmPassword?.errors?.['passwordMismatch']">Passwords do not match</span>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="d-grid gap-2">
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="signupForm.invalid || isLoading"
            >
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </div>

          <div class="auth-links">
            <a routerLink="/login">Already have an account? Sign in</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    console.log('Form submitted, valid:', this.signupForm.valid);
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.signupForm.value;
      console.log('Sending registration request to API');
      
      this.authService.register(email, password).subscribe({
        next: (response: LoginResponse) => {
          console.log('Registration successful:', response);
          // Store the token or user info in localStorage/sessionStorage
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']); // Navigate to dashboard or home page
        },
        error: (error: any) => {
          console.error('Registration failed:', error);
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
} 