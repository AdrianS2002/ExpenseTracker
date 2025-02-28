import { Component, inject } from '@angular/core';
import { ExpenseComponent } from "./expense/expense.component";
import { ExpensesTrackerService } from '../expenses-tracker.service';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [ExpenseComponent],
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.css'
})
export class ExpensesListComponent {
  expenseTrackerService = inject(ExpensesTrackerService);
}
