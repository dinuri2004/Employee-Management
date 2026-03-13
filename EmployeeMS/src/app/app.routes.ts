import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeForm } from './employee/employee-form/employee-form';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'employees/new', component: EmployeeForm, canActivate: [authGuard] },
  { path: 'employees/edit/:id', component: EmployeeForm, canActivate: [authGuard] }
];
