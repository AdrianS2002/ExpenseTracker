import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/databse.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weekly-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weekly-budget.component.html',
  styleUrls: ['./weekly-budget.component.css']
})
export class WeeklyBudgetComponent {
  spendingCap: number = 0; // Current weekly budget
  newCap: number = 0; // Temporary variable for editing
  isLoading: boolean = false; // Loading state

  @Output() closeModal = new EventEmitter<void>(); // Emit when the modal should close
  @Output() budgetSet = new EventEmitter<number>(); // Emit the new budget

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.isLoading = true;
        this.databaseService.fetchWeeklyCap(user.id).subscribe(
          (data) => {
            this.spendingCap = data.weeklySpendingCap || 0;
            this.newCap = this.spendingCap; // Initialize newCap with the current budget
            this.isLoading = false;
          },
          (error) => {
            console.error(error);
            this.isLoading = false;
          }
        );
      }
    });
  }

  saveCap(): void {
    this.isLoading = true;
    this.authService.user.subscribe(user => {
      if (user) {
        this.databaseService.updateWeeklyCap(user.id, this.newCap).subscribe(
          () => {
            this.spendingCap = this.newCap;
            this.isLoading = false;
            this.budgetSet.emit(this.newCap); // Emit the new budget
            this.closeModal.emit(); // Close the modal
          },
          (error) => {
            console.error(error);
            this.isLoading = false;
          }
        );
      }
    });
  }

  cancelEdit(): void {
    this.closeModal.emit(); // Close the modal without saving
  }
}
