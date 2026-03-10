import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): boolean {
    // In a real application, you would validate against a backend API
    // For demo purposes, we'll use simple validation
    const storedUsers = this.getStoredUsers();
    const user = storedUsers.find(u => u.username === username && u.password === password);

    if (user) {
      const userInfo: User = { username: user.username, email: user.email };
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      this.currentUserSubject.next(userInfo);
      return true;
    }
    return false;
  }

  register(username: string, email: string, password: string): boolean {
    // Check if user already exists
    const storedUsers = this.getStoredUsers();
    const existingUser = storedUsers.find(u => u.username === username || u.email === email);

    if (existingUser) {
      return false; // User already exists
    }

    // Store new user
    const newUser = { username, email, password };
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    // Auto-login after registration
    const userInfo: User = { username, email };
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    this.currentUserSubject.next(userInfo);
    return true;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  private getStoredUsers(): any[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
}
