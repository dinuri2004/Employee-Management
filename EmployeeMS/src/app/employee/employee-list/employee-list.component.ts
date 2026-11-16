import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  displayedColumns: string[] = ['avatar', 'id', 'name', 'email', 'address', 'status', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  username = '';
  searchTerm = '';

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  constructor(
    private empService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.currentUserValue?.username || 'Admin';
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.empService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.applySearch();
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }

  get totalEmployees(): number {
    return this.employees.length;
  }

  get activePersonnel(): number {
    return this.employees.length;
  }

  get uniqueLocations(): number {
    if (!this.employees.length) return 0;
    const locations = new Set(
      this.employees
        .map(e => (e.address || '').trim().toLowerCase())
        .filter(addr => addr.length > 0)
    );
    return locations.size || 1;
  }

  getInitials(firstName?: string, lastName?: string): string {
    const first = (firstName || '').trim().charAt(0).toUpperCase();
    const last = (lastName || '').trim().charAt(0).toUpperCase();
    return `${first}${last}` || 'SP';
  }

  getAvatarColor(id: number): string {
    const colors = [
      'linear-gradient(135deg, #2563EB, #1D4ED8)', // Royal Blue
      'linear-gradient(135deg, #14B8A6, #0D9488)', // Teal
      'linear-gradient(135deg, #8B5CF6, #7C3AED)', // Purple
      'linear-gradient(135deg, #142B4A, #1E3A63)'  // Deep Navy
    ];
    return colors[Math.abs(id) % colors.length];
  }

  onSearchChange(): void {
    this.applySearch();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applySearch();
  }

  isRowHighlighted(emp: Employee): boolean {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      return false;
    }

    const idText = String(emp.id ?? '').toLowerCase();
    const firstName = (emp.firstName ?? '').toLowerCase();
    const lastName = (emp.lastName ?? '').toLowerCase();
    const email = (emp.email ?? '').toLowerCase();
    const address = (emp.address ?? '').toLowerCase();
    return idText.includes(query) || firstName.includes(query) || lastName.includes(query) || email.includes(query) || address.includes(query);
  }

  private applySearch(): void {
    const query = this.searchTerm.trim().toLowerCase();

    if (!query) {
      this.filteredEmployees = [...this.employees];
      this.dataSource.data = [...this.employees];
      return;
    }

    this.filteredEmployees = this.employees.filter((emp) => {
      const idText = String(emp.id ?? '').toLowerCase();
      const firstName = (emp.firstName ?? '').toLowerCase();
      const lastName = (emp.lastName ?? '').toLowerCase();
      const email = (emp.email ?? '').toLowerCase();
      const address = (emp.address ?? '').toLowerCase();
      return idText.includes(query) || firstName.includes(query) || lastName.includes(query) || email.includes(query) || address.includes(query);
    });

    this.dataSource.data = [...this.filteredEmployees];
  }

  addEmployee(): void {
    this.router.navigate(['/employees/new']);
  }

  editEmployee(emp: Employee): void {
    this.router.navigate(['/employees/edit', emp.id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to remove this employee from StaffSphere?')) {
      this.empService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          alert('Failed to delete employee');
        }
      });
    }
  }
}
