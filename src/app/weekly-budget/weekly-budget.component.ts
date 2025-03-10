import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../database/models/user.model';
import { DatabaseService } from '../database/databse.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weekly-budget',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './weekly-budget.component.html',
  styleUrls: ['./weekly-budget.component.css']
})
export class WeeklyBudgetComponent implements OnInit {
  user: User | undefined;
  editMode: boolean = false;
  newBudget: number = 0;
  isLoading: boolean = false; // flag for spinner

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    console.log('WeeklyBudgetComponent initialized.');
    this.authService.user.subscribe(user => {
      console.log('AuthService emitted user:', user);
      if (user) {
        this.user = user;
        console.log('Current user:', this.user);
        // Setăm spinner-ul la începutul operației de retrieve
        this.isLoading = true;
        this.databaseService.getWeeklyBudget(user.id).subscribe(
          budget => {
            console.log("Retrieved weeklyBudget from Firestore:", budget);
            this.user!.weeklyBudget = budget;
            console.log("User after updating weeklyBudget:", this.user);
            // Sincronizează newBudget cu valoarea din Firestore
            this.newBudget = budget;
            
            // Calculăm data de luni a săptămânii curente
            const now = new Date();
            const monday = this.getMonday(now);
            console.log("Current date:", now);
            console.log("Calculated Monday:", monday);
            console.log("User.lastWeeklyBudgetUpdate:", this.user!.lastWeeklyBudgetUpdate);
            
            if (this.user!.lastWeeklyBudgetUpdate < monday) {
              console.log("Weekly budget expired. Resetting budget to 0...");
              // Resetăm bugetul la 0 dacă a expirat
              this.databaseService.updateUserWeeklyBudget(user.id, 0).subscribe(() => {
                console.log("Weekly budget reset in Firestore.");
                this.user!.weeklyBudget = 0;
                this.newBudget = 0;
                const updatedUserData = {
                  email: this.user!.emaiL,
                  id: this.user!.id,
                  _token: this.user!.token,
                  _tokenExpirationDate: this.user!._tokenExpirationDate.toISOString(),
                  weeklyBudget: 0,
                  lastWeeklyBudgetUpdate: new Date().toISOString()
                };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
                console.log("Updated userData in localStorage:", updatedUserData);
                this.isLoading = false;
              }, error => {
                console.error("Error resetting weekly budget:", error);
                this.isLoading = false;
              });
            } else {
              console.log("Weekly budget is valid. Using retrieved value.");
              this.isLoading = false;
            }
          },
          error => {
            console.error("Error retrieving weekly budget:", error);
            this.isLoading = false;
          }
        );
      }
    });
  }

  // Calculează data de luni a săptămânii curente.
  getMonday(date: Date): Date {
    const day = date.getDay(); // Duminică = 0, Luni = 1, etc.
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.getFullYear(), date.getMonth(), diff);
    console.log("getMonday() called. Date:", date, "Monday:", monday);
    return monday;
  //   const day = date.getDay(); // Duminică = 0, Luni = 1, etc.
  // const diff = day === 0 ? 0 : 7 - day;
  // const sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
  // console.log("getSunday() called. Date:", date, "Sunday:", sunday);
  // return sunday;
  }

  // Activează modul de editare
  onEdit(): void {
    this.editMode = true;
    this.newBudget = this.user?.weeklyBudget || 0;
  }

  // Anulează editarea
  onCancelEdit(): void {
    this.editMode = false;
    this.newBudget = this.user?.weeklyBudget || 0;
  }

  // Salvează noul buget și actualizează Firestore
  onSave(): void {
    if (!this.user) return;
    // Afișăm spinner-ul în timpul operației de save
    this.isLoading = true;
    this.databaseService.updateUserWeeklyBudget(this.user.id, this.newBudget).subscribe(
      () => {
        console.log('Weekly budget updated successfully');
        this.user!.weeklyBudget = this.newBudget;
        this.user!.lastWeeklyBudgetUpdate = new Date();
        this.editMode = false;
        this.isLoading = false;
        // Actualizează localStorage (dacă este necesar)
        const updatedUserData = {
          weeklyBudget: this.user!.weeklyBudget,
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }
}
