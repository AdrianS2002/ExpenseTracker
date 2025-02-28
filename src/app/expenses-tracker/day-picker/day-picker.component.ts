import { Component, inject } from '@angular/core';
import { ExpensesTrackerService } from '../expenses-tracker.service';

@Component({
  selector: 'app-day-picker',
  standalone: true,
  imports: [],
  templateUrl: './day-picker.component.html',
  styleUrl: './day-picker.component.css'
})
export class DayPickerComponent {
  expensesTrackerService = inject(ExpensesTrackerService);
}
