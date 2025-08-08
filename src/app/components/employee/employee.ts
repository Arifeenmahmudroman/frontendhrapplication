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
          this.message = response;
          this.loadEmployees();
          this.selectedFile = null;
        },
        error: () => this.message = 'Error importing file'
      });
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
  }
}
