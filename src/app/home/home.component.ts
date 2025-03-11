import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/databse.service';
import { WeeklyBudgetComponent } from '../weekly-budget/weekly-budget.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, WeeklyBudgetComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  router = inject(Router);
  authServices = inject(AuthService);
  databaseService = inject(DatabaseService);

  isModalOpen: boolean = false; // Controls the modal visibility
  weeklyBudget: number | null = null; // Stores the weekly budget

  ngOnInit(): void {
    // Fetch the current budget when the component loads (only if the user is logged in)
    if (this.authServices.isLogged()) {
      this.authServices.user.subscribe(user => {
        if (user) {
          this.databaseService.fetchWeeklyCap(user.id).subscribe(
            (data) => {
              this.weeklyBudget = data.weeklySpendingCap || null;
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
    }
  }

  // Open the modal
  openModal(): void {
    this.isModalOpen = true;
  }

  // Close the modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Handle the budget set event
  onBudgetSet(newBudget: number): void {
    this.weeklyBudget = newBudget;
    this.closeModal();
  }

  navigateToExpenses(): void {
    this.router.navigate(['/expenses']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }
}
