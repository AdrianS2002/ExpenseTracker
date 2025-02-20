import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DayPickerComponent } from "./expenses-tracker/day-picker/day-picker.component";
import { ExpensesListComponent } from "./expenses-tracker/expenses-list/expenses-list.component";
import { ExpenseComponent } from "./expenses-tracker/expenses-list/expense/expense.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DayPickerComponent, ExpensesListComponent, ExpenseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ExpenseTracker';
}
