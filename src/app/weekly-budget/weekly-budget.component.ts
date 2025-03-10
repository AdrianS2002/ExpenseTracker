import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/databse.service';

@Component({
  selector: 'app-weekly-budget',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './weekly-budget.component.html',
  styleUrls: ['./weekly-budget.component.css']
})
export class WeeklyBudgetComponent implements OnInit {
  spendingCap: number = 0;
  isEditingCap: boolean = false;
  newCap: number = 0;
  isLoading: boolean = false;

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

  startCapEdit(): void {
    console.log('Edit button clicked'); // Debugging
    this.isEditingCap = true;
    console.log('isEditingCap:', this.isEditingCap); // Debugging
    this.newCap = this.spendingCap;
  }

  cancelCapEdit(): void {
    this.isEditingCap = false;
    this.newCap = this.spendingCap;
  }

  saveCap(): void {
    this.isLoading = true;
    this.authService.user.subscribe(user => {
      if (user) {
        this.databaseService.updateWeeklyCap(user.id, this.newCap).subscribe(
          () => {
            this.spendingCap = this.newCap;
            this.isEditingCap = false;
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
}
