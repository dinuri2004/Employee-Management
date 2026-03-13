import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from './auth/auth.service';

interface UserProfile {
  firstName: string;
  lastName: string;
  address: string;
  telephone: string;
  email: string;
  photoDataUrl: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Employee Management System';
  currentUser: User | null = null;
  showProfilePanel = false;

  profile: UserProfile = {
    firstName: '',
    lastName: '',
    address: '',
    telephone: '',
    email: '',
    photoDataUrl: ''
  };

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadProfile();
      }
    });
  }

  toggleProfilePanel(): void {
    this.showProfilePanel = !this.showProfilePanel;
  }

  private getProfileStorageKey(): string {
    return `profile_${this.currentUser?.username || 'guest'}`;
  }

  private loadProfile(): void {
    const key = this.getProfileStorageKey();
    const stored = localStorage.getItem(key);

    if (stored) {
      this.profile = JSON.parse(stored) as UserProfile;
    }

    if (this.currentUser) {
      // Always keep email synced with authenticated account and non-editable.
      this.profile.email = this.currentUser.email;
    }
  }

  saveProfile(): void {
    if (this.currentUser) {
      this.profile.email = this.currentUser.email;
    }
    localStorage.setItem(this.getProfileStorageKey(), JSON.stringify(this.profile));
    alert('Profile updated successfully.');
    this.showProfilePanel = false;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.profile.photoDataUrl = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  }

  removeProfilePhoto(): void {
    this.profile.photoDataUrl = '';
    localStorage.setItem(this.getProfileStorageKey(), JSON.stringify(this.profile));
  }

  getProfilePhoto(): string {
    if (this.profile.photoDataUrl) {
      return this.profile.photoDataUrl;
    }
    return 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/person-circle.svg';
  }

  logout(): void {
    this.showProfilePanel = false;
    this.authService.logout();
  }
}
