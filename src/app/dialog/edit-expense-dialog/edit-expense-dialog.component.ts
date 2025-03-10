import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ExpensesTrackerService } from '../../expenses-tracker/expenses-tracker.service';
import { Category } from '../../database/models/category.model';

export interface EditExpenseData {
  id: string;
  name: string;
  categoryId: string; // changed from category to categoryId
  amount: number;
}

@Component({
  selector: 'app-edit-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Expense</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="data.name" name="name">
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Category</mat-label>
        <mat-select [(ngModel)]="data.categoryId" name="categoryId" (ngModelChange)="onCategoryChange($event)">
          <mat-option *ngFor="let cat of availableCategoriesValue" [value]="cat.id">
            {{ cat.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Amount</mat-label>
        <input type="number" matInput [(ngModel)]="data.amount" name="amount">
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button (click)="onSave()">Save</button>
    </div>
  `,
  styles: [`
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
    }
    mat-form-field {
      display: block;
      width: 100%;
      margin-bottom: 10px;
    }
  `]
})
export class EditExpenseDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditExpenseData,
    private expensesTrackerService: ExpensesTrackerService
  ) {}

  // Getter: call the signal to get the current array of available categories.
  get availableCategoriesValue(): Category[] {
    return this.expensesTrackerService.getExpenseCategories()();
  }

  onCategoryChange(newCategoryId: string): void {
    console.log('Category changed to:', newCategoryId);
    this.data.categoryId = newCategoryId;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log('Saving expense with data:', this.data);
    this.dialogRef.close({
      name: this.data.name,
      categoryId: this.data.categoryId,
      amount: this.data.amount
    });
  }
}
