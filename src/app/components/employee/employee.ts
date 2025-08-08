/*import { Component } from '@angular/core';

@Component({
  selector: 'app-employee',
  imports: [],
  templateUrl: './employee.html',
  styleUrl: './employee.css'
})
export class Employee {

}*/

// src/app/components/employee/employee.component.ts
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/Employee.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee = {
    id: 0,
    firstname: '',
    lastname: '',
    title: '',
    division: '',
    building: '',
    room: ''
  };
  selectedFile: File | null = null;
  message: string = '';

  searchId: number | null = null; // For search input
  searchedEmployee: Employee | null = null; // To store search result

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => this.employees = data,
      error: (error) => this.message = 'Error loading employees'
    });
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployee = { ...employee };
  }

  updateEmployee(): void {
    if (this.selectedEmployee.id) {
      this.employeeService.updateEmployee(this.selectedEmployee.id, this.selectedEmployee)
        .subscribe({
          next: () => {
            this.message = 'Employee updated successfully';
            this.loadEmployees();
            this.resetForm();
          },
          error: () => this.message = 'Error updating employee'
        });
    }
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.message = 'Employee deleted successfully';
        this.loadEmployees();
      },
      error: () => this.message = 'Error deleting employee'
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  importFile(): void {
    if (this.selectedFile) {
      this.employeeService.importXmlFile(this.selectedFile).subscribe({
        next: (response) => {
          this.message = 'XML file imported successfully! Page will reload in 2 seconds.';
          this.message = response;
          this.loadEmployees();
          this.selectedFile = null;
          setTimeout(() => {
            window.location.reload(); // Reload the page
          }, 2000);
        },
        // error: () => this.message = 'Error importing file'
        error: () => {
          this.message = 'Error importing XML file';
          this.selectedFile = null;
        }
      });
    }
    else {
      this.message = 'Please select an XML file to import';
    }
  }
  // New search method
  searchEmployee(): void {
    if (this.searchId) {
      this.employeeService.getEmployee(this.searchId).subscribe({
        next: (employee) => {
          this.searchedEmployee = employee;
          this.message = '';
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.message = `Employee with ID ${this.searchId} not found`;
          } else {
            this.message = 'Error searching for employee';
          }
          this.searchedEmployee = null;
        }
      });
    } else {
      this.message = 'Please enter a valid Employee ID';
      this.searchedEmployee = null;
    }
  }

  resetForm(): void {
    this.selectedEmployee = {
      id: 0,
      firstname: '',
      lastname: '',
      title: '',
      division: '',
      building: '',
      room: ''
    };
    this.searchedEmployee = null; // Clear search result
    this.searchId = null; // Clear search input
  }
}
