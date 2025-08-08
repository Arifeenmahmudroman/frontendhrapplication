import { Routes } from '@angular/router';
import {EmployeeComponent} from './components/employee/employee';

export const routes: Routes = [
  {path: '', component: EmployeeComponent},
  {path:'**', redirectTo:''}

];
