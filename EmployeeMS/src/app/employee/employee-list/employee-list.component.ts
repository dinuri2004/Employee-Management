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

  // ✅ Used by mat-table
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'address', 'actions'];
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
    this.username = this.authService.currentUserValue?.username || 'User';
    this.loadEmployees();
  }

  loadEmployees(): void {
    console.log('Loading employees...');
    this.empService.getEmployees().subscribe({
      next: (data) => {
        console.log('Received data:', data);
        console.log('Data length:', data.length);
        this.employees = data;
        this.applySearch();
        console.log('DataSource updated:', this.dataSource.data);
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        alert('Failed to load employees. Make sure the Spring Boot backend is running.');
      }
    });
  }

  onSearchChange(): void {
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
    return idText.includes(query) || firstName.includes(query) || lastName.includes(query);
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
      return idText.includes(query) || firstName.includes(query) || lastName.includes(query);
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
    if (confirm('Are you sure you want to delete this employee?')) {
      this.empService.deleteEmployee(id).subscribe({
        next: () => {
          alert('Employee deleted successfully!');
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
