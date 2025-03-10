import { Component } from '@angular/core';
import { SummaryComponent } from "../summary/summary.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SummaryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showAddExpenseForm: boolean = false;
  showAddCategoryForm: boolean = false;
}
