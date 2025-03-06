import { Component, inject, input } from '@angular/core';
import { ExpensesTrackerService } from '../../expenses-tracker.service';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
  expenseTrackerService = inject(ExpensesTrackerService);

  id = input<string>();
  amount = input<number>();
  name = input<string>();
  category = input<string>();
}
