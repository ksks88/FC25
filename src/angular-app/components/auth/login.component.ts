import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../src/app/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container fade-in">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
                placeholder="Enter your password"
                [class.is-invalid]="password?.invalid && password?.touched"
              >
            </div>
            <div class="invalid-feedback" *ngIf="password?.invalid && password?.touched">
              <span *ngIf="password?.errors?.['required']">Password is required</span>
              <span *ngIf="password?.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="d-grid gap-2">
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="loginForm.invalid || isLoading"
            >
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </div>

          <div class="auth-links">
            <a routerLink="/forgot-password" class="me-3">Forgot Password?</a>
            <a routerLink="/signup">Don't have an account? Sign up</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    console.log('Form submitted, valid:', this.loginForm.valid);
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      console.log('Sending login request to API');
      
      this.authService.login(email, password).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful:', response);
          // Store the token or user info in localStorage/sessionStorage
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']); // Navigate to dashboard or home page
        },
        error: (error: any) => {
          console.error('Login failed:', error);
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
} 