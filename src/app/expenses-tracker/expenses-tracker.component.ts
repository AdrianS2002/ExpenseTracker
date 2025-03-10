import { Component, inject } from '@angular/core';
import { ExpensesListComponent } from "./expenses-list/expenses-list.component";
import { DayPickerComponent } from "./day-picker/day-picker.component";
import { AddExpenseComponent } from "./add-expense/add-expense.component";
import { ExpensesTrackerService } from './expenses-tracker.service';

@Component({
  selector: 'app-expenses-tracker',
  standalone: true,
  imports: [ExpensesListComponent, DayPickerComponent, AddExpenseComponent],
  templateUrl: './expenses-tracker.component.html',
  styleUrl: './expenses-tracker.component.css'
})
export class ExpensesTrackerComponent {
  expenseService = inject(ExpensesTrackerService);
  showForm = this.expenseService.showForm;
}
