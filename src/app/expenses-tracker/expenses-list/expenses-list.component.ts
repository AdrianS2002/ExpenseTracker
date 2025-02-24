import { Component } from '@angular/core';
import { ExpenseComponent } from "./expense/expense.component";

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [ExpenseComponent],
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.css'
})
export class ExpensesListComponent {

}
