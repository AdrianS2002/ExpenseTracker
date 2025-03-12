import { Component } from '@angular/core';
import { WeeklyBudgetComponent } from "../weekly-budget/weekly-budget.component";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [WeeklyBudgetComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {

}
