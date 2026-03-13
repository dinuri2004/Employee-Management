import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      
      this.authService.requestPasswordReset(email).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = response.message + ' Please check your email inbox.';
            this.forgotPasswordForm.reset();
            this.submitted = false;
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Failed to send reset email. Please try again.';
          console.error('Password reset error:', error);
        }
      });
    } else {
      this.loading = false;
      this.forgotPasswordForm.get('email')?.markAsTouched();
    }
  }
}
