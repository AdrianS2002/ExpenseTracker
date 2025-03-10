import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpensesTrackerService } from '../../expenses-tracker.service';
import { ConfirmDialogComponent } from '../../../dialog/confirm-dialog/confirm-dialog.component';
import { EditExpenseDialogComponent, EditExpenseData } from '../../../dialog/edit-expense-dialog/edit-expense-dialog.component';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [EditExpenseDialogComponent, ConfirmDialogComponent],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent {
  expenseTrackerService = inject(ExpensesTrackerService);
  private dialog = inject(MatDialog);

  @Input() id!: string;
  @Input() amount!: number;
  @Input() name!: string;
  @Input() categoryId!: string; // renamed property

  // Getter to retrieve the category name from the service using the categoryId.
  get categoryName(): string {
    return this.expenseTrackerService.getCategoryNameById(this.categoryId);
  }

  deleteExpense(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this expense?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseTrackerService.deleteExpense(this.id);
      }
    });
  }

  editExpense(): void {
    const dialogRef = this.dialog.open(EditExpenseDialogComponent, {
      width: '300px',
      data: <EditExpenseData>{
        id: this.id,
        name: this.name,
        categoryId: this.categoryId,
        amount: this.amount
      }
    });

    dialogRef.afterClosed().subscribe(updatedExpense => {
      if (updatedExpense) {
        this.expenseTrackerService.updateExpense(this.id, updatedExpense);
        // Update local properties to refresh the display immediately.
        this.name = updatedExpense.name;
        this.categoryId = updatedExpense.categoryId;
        this.amount = updatedExpense.amount;
      }
    });
  }
}
