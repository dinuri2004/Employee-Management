import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, timeout } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  username: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

interface PasswordResetResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, email, password });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  requestPasswordReset(email: string): Observable<PasswordResetResponse> {
    return this.http
      .post<PasswordResetResponse>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(timeout(15000));
  }

  resetPassword(token: string, password: string): Observable<PasswordResetResponse> {
    return this.http
      .post<PasswordResetResponse>(`${this.apiUrl}/reset-password`, { token, password })
      .pipe(timeout(15000));
  }
}
