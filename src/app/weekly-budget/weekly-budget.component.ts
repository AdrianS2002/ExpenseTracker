import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/databse.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../database/models/user.model';

@Component({
  selector: 'app-weekly-budget',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './weekly-budget.component.html',
  styleUrls: ['./weekly-budget.component.css']
})
export class WeeklyBudgetComponent implements OnInit, OnDestroy {
  user: User | undefined;
  editMode: boolean = false;
  newBudget: number = 0;
  isLoading: boolean = false;
  remainingBudget: number = 0; 

  private userSub?: Subscription;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('WeeklyBudgetComponent initialized.');
    this.userSub = this.authService.user.subscribe(user => {
      console.log('AuthService emitted user:', user);
      if (user) {
        this.user = user;
        this.isLoading = true;
     
        this.databaseService.getWeeklyBudget(user.id).subscribe(
          budget => {
            console.log("Retrieved weeklyBudget from Firestore:", budget);
            this.user!.weeklyBudget = budget;
            this.newBudget = budget;
           
            this.recalcRemainingBudget(user.id);
            this.isLoading = false;
          },
          error => {
            console.error("Error retrieving weekly budget:", error);
            this.isLoading = false;
          }
        );
      } else {
        this.router.navigate(['/auth']);
      }
    });
  }

  
  private recalcRemainingBudget(userId: string): void {
    const weekDates = this.getWeekDates();
    console.log('Calculated week dates for remaining budget:', weekDates);
    
    const expenseObservables = weekDates.map(date => {
      console.log(`Fetching expenses for date ${date}...`);
      return this.databaseService.getExpensesForDate(userId, date).pipe(
        catchError(err => {
          console.error(`Error fetching expenses for ${date}:`, err);
          return of([]);
        })
      );
    });
    forkJoin(expenseObservables).subscribe(expensesArrays => {
      const allExpenses = expensesArrays.flat();
      const totalExpenses = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      console.log("Total expenses for the week:", totalExpenses);
      this.remainingBudget = this.user!.weeklyBudget - totalExpenses;
      console.log("Remaining budget recalculated:", this.remainingBudget);
    },
    err => {
      console.error("Error calculating weekly expenses:", err);
    });
  }

  // Când utilizatorul intră în modul de editare
  onEdit(): void {
    this.editMode = true;
    this.newBudget = this.user?.weeklyBudget || 0;
    if (this.user) {
      this.recalcRemainingBudget(this.user.id);
    }
  }

 
  onCancelEdit(): void {
    this.editMode = false;
    this.newBudget = this.user?.weeklyBudget || 0;
    if (this.user?.id) {
      this.recalcRemainingBudget(this.user.id);
    }
  }


  onSave(): void {
    if (!this.user) return;
    this.isLoading = true;
    this.databaseService.updateUserWeeklyBudget(this.user.id, this.newBudget).subscribe(
      () => {
        console.log('Weekly budget updated successfully');
        this.user!.weeklyBudget = this.newBudget;
        this.editMode = false;
        this.isLoading = false;
        if (!this.user) return;
        this.recalcRemainingBudget(this.user.id);
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  private getWeekDates(): string[] {
    const dates: string[] = [];
    const now = new Date();
    const day = now.getDay() === 0 ? 7 : now.getDay();
    const diffToMonday = 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(this.formatDate(date));
    }
    return dates;
  }
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
