import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Get token from URL query parameters
    this.token = this.route.snapshot.queryParams['token'] || '';
    
    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token. Please request a new password reset link.';
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.token) {
      this.errorMessage = 'Invalid reset token.';
      return;
    }

    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.password;
      
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Password reset successfully! Redirecting to login...';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to reset password. The link may have expired.';
          console.error('Password reset error:', error);
        }
      });
    } else {
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        this.resetPasswordForm.get(key)?.markAsTouched();
      });
    }
  }

  get passwordMismatch(): boolean {
    return this.resetPasswordForm.hasError('passwordMismatch') && 
           this.resetPasswordForm.get('confirmPassword')?.touched || false;
  }
}
