import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

export interface LocationStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

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

  locationDistribution: LocationStat[] = [];
  totalEmployeesCount = 0;
  activePersonnelCount = 0;
  uniqueLocationsCount = 0;

  constructor(
    private empService: EmployeeService,
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.username = this.authService.currentUserValue?.username || 'Admin';
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.empService.getEmployees().subscribe({
      next: (data) => {
        this.employees = Array.isArray(data) ? data : [];
        this.updateStats();
        this.applySearch();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.cdr.detectChanges();
      }
    });
  }

  private updateStats(): void {
    const list = this.employees;
    this.totalEmployeesCount = list.length;
    this.activePersonnelCount = list.filter(e => (e.status || 'Active').toLowerCase() === 'active').length;

    if (!list.length) {
      this.uniqueLocationsCount = 0;
      this.locationDistribution = [];
      return;
    }

    const counts: { [key: string]: number } = {};
    for (const emp of list) {
      const raw = (emp.address || 'Headquarters').split(',')[0].trim();
      const loc = raw ? (raw.charAt(0).toUpperCase() + raw.slice(1)) : 'Headquarters';
      counts[loc] = (counts[loc] || 0) + 1;
    }

    const colors = ['#2563EB', '#14B8A6', '#8B5CF6', '#142B4A', '#F59E0B', '#EC4899'];
    const locNames = Object.keys(counts);
    this.uniqueLocationsCount = locNames.length;
    this.locationDistribution = locNames.map((key, i) => ({
      name: key,
      count: counts[key],
      percentage: Math.round((counts[key] / list.length) * 100),
      color: colors[i % colors.length]
    }));
  }

  get totalEmployees(): number {
    return this.totalEmployeesCount;
  }

  get activePersonnel(): number {
    return this.activePersonnelCount;
  }

  get uniqueLocations(): number {
    return this.uniqueLocationsCount;
  }

  trackByEmp(index: number, item: Employee): number {
    return item.id;
  }

  trackByLoc(index: number, item: LocationStat): string {
    return item.name;
  }

  onStatusChange(emp: Employee, newStatus: string): void {
    const prevStatus = emp.status || 'Active';
    emp.status = newStatus;
    this.updateStats();

    this.empService.updateStatus(emp.id, newStatus).subscribe({
      next: (updated) => {
        emp.status = updated.status || newStatus;
        this.updateStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating status via patch:', err);
        // Fallback to updateEmployee
        const copy: Employee = { ...emp, status: newStatus };
        this.empService.updateEmployee(emp.id, copy).subscribe({
          next: (saved) => {
            emp.status = saved.status || newStatus;
            this.updateStats();
            this.cdr.detectChanges();
          },
          error: () => {
            emp.status = prevStatus;
            this.updateStats();
            this.cdr.detectChanges();
            alert('Failed to update employee status');
          }
        });
      }
    });
  }

  getStatusClass(status?: string): string {
    const s = (status || 'Active').toLowerCase();
    if (s === 'on leave') return 'status-leave';
    if (s === 'inactive') return 'status-inactive';
    return 'status-active';
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
