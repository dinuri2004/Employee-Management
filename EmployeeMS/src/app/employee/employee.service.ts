import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8081/api/employees'; // Spring Boot backend API

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const currentUser = this.authService.currentUserValue;
    const headers = new HttpHeaders();
    if (currentUser) {
      return headers.set('X-Username', currentUser.username);
    }
    return headers;
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  addEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, emp, { headers: this.getHeaders() });
  }

  updateEmployee(id: number, emp: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, emp, { headers: this.getHeaders() });
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
