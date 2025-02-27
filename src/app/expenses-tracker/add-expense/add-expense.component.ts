import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../database/databse.service';
import { ExpensesTrackerService } from '../expenses-tracker.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent {
   expensesTrackerService = inject(ExpensesTrackerService);

   expenseForm = new FormGroup({
     name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required)
    });

    showForm = false;

    onSubmit() {
      console.log("Form values:", this.expenseForm.value);

      this.expensesTrackerService.addExpense(this.expenseForm.value.name!, 
        Number(this.expenseForm.value.amount!),
        this.expenseForm.value.categoryId!);

      this.expenseForm.reset();
      this.expenseForm.patchValue({ categoryId: '' });
      this.showForm = false;
    }
}
