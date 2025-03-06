import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface EditExpenseData {
  id: string;
  name: string;
  category: string;
  amount: number;
}

@Component({
  selector: 'app-edit-expense-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Expense</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="data.name">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Category</mat-label>
        <input matInput [(ngModel)]="data.category">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Amount</mat-label>
        <input type="number" matInput [(ngModel)]="data.amount">
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
    @Inject(MAT_DIALOG_DATA) public data: EditExpenseData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({
      name: this.data.name,
      category: this.data.category,
      amount: this.data.amount
    });
  }
}
