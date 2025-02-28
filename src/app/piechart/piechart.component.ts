import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/databse.service';
import { Category } from '../database/models/category.model';
import { Expense } from '../database/models/expenses.model';
import { generateColors, generateHoverColors } from './colorgenerator';

@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PieChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  private chart?: Chart;
  private userSub?: Subscription;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('PieChartComponent initialized.');
    this.isLoading = true; // setăm spinner-ul la start
    // Abonare la user pentru a obține ID-ul
    this.userSub = this.authService.user.subscribe(user => {
      console.log('AuthService emitted user:', user);
      if (!user) {
        console.log('User not authenticated in PieChartComponent.');
        this.isLoading = false;
        return;
      }
      const userId = user.id;
      const weekDates = this.getWeekDates();
      console.log('Calculated week dates:', weekDates);

      // Pentru fiecare zi, preia cheltuielile
      const expenseObservables = weekDates.map(date => {
        console.log(`Fetching expenses for date ${date}...`);
        return this.databaseService.getExpensesForDate(userId, date).pipe(
          catchError(err => {
            console.error(`Error fetching expenses for ${date}:`, err);
            return of([]);
          })
        );
      });
      // Preia și categoriile
      const categoriesObs = this.databaseService.getCategories(userId).pipe(
        catchError(err => {
          console.error('Error fetching categories:', err);
          return of([]);
        })
      );

      // Așteaptă ca toate observable-urile să emită date și finalizează încărcarea
      forkJoin([forkJoin(expenseObservables), categoriesObs]).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(
        ([expensesArrays, categories]) => {
          console.log('Expenses arrays received:', expensesArrays);
          console.log('Categories received:', categories);
          const allExpenses: Expense[] = expensesArrays.flat();
          console.log('All expenses:', allExpenses);

          // Calculează totalul pentru fiecare categorie
          const categoryTotals: { [key: string]: number } = {};
          allExpenses.forEach(expense => {
            const catId = expense.categoryId;
            categoryTotals[catId] = (categoryTotals[catId] || 0) + expense.amount;
          });
          console.log('Category totals:', categoryTotals);

          // Construiește etichetele și datele pentru grafic
          const labels: string[] = [];
          const data: number[] = [];
          for (const catId in categoryTotals) {
            const cat = categories.find((c: Category) => c.id === catId);
            labels.push(cat ? cat.name : `Category ${catId}`);
            data.push(categoryTotals[catId]);
          }
          console.log('Chart labels:', labels);
          console.log('Chart data:', data);
          // Creează pie chart-ul
          this.createChart(labels, data);
        },
        err => {
          console.error('Error in forkJoin subscription:', err);
          this.isLoading = false;
        }
      );
    });
  }

  ngOnDestroy(): void {
    console.log('PieChartComponent is being destroyed.');
    this.userSub?.unsubscribe();
    this.chart?.destroy();
  }

  private createChart(labels: string[], data: number[]): void {
    if (this.chart) {
      console.log('Destroying existing chart instance.');
      this.chart.destroy();
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not retrieve 2D context from canvas.');
      return;
    }
    const backgroundColors = generateColors(labels.length);
    const hoverBackgroundColors = generateHoverColors(labels.length);
    console.log('Creating chart with context:', ctx);
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
    console.log('Chart instance created:', this.chart);
  }

  /**
   * Returnează un array de date (format "YYYY-MM-DD") pentru săptămâna curentă (luni-duminică)
   */
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

  /**
   * Formatează o dată ca "YYYY-MM-DD"
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
