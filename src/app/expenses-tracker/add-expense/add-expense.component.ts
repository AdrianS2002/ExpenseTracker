import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../database/databse.service';
import { ExpensesTrackerService } from '../expenses-tracker.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent {
   expensesTrackerService = inject(ExpensesTrackerService);
}
