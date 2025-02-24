import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ExpensesTrackerComponent } from "./expenses-tracker/expenses-tracker.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExpensesTrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ExpenseTracker';
}
