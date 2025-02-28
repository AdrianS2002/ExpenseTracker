import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpensesTrackerService } from '../../expenses-tracker.service';
import { ConfirmDialogComponent } from '../../../dialog/confirm-dialog.component';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent {
  expenseTrackerService = inject(ExpensesTrackerService);
  private dialog = inject(MatDialog);

  @Input() id!: string;
  @Input() amount!: number;
  @Input() name!: string;
  @Input() category!: string;

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
}
