import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DayPickerComponent } from "./expenses-tracker/day-picker/day-picker.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DayPickerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ExpenseTracker';
}
