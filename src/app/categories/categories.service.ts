import { inject, Injectable, Signal, signal } from '@angular/core';
import { DatabaseService } from '../database/databse.service';
import { Category } from '../database/models/category.model';
import { catchError, tap, of } from 'rxjs';

interface UserData {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly databaseService = inject(DatabaseService);
  
  private categories = signal<Category[]>([]);

  constructor() {
    this.fetchCategories();
  }

  getCategories(): Signal<Category[]> {
    return this.categories.asReadonly();
  }

  addCategory(name: string): void {
    const userData = this.getUserData();
    if (!userData) return;

    const category: Omit<Category, 'id'> = { name };

    this.databaseService.addCategory(userData.id, category).pipe(
      tap(() => this.fetchCategories()),
      catchError(error => {
        console.error('Failed to add category:', error);
        return of(null);
      })
    ).subscribe();
  }

  deleteCategory(categoryId: string): void {
    const userData = this.getUserData();
    if (!userData) return;

    this.databaseService.deleteCategory(userData.id, categoryId).pipe(
      tap(() => this.fetchCategories()),
      catchError(error => {
        console.error('Failed to delete category:', error);
        return of(null);
      })
    ).subscribe();
  }

  private fetchCategories(): void {
    const userData = this.getUserData();
    if (!userData) return;

    this.databaseService.getCategories(userData.id).pipe(
      catchError(error => {
        console.error('Failed to fetch categories:', error);
        return of([]);
      })
    ).subscribe(categories => this.categories.set(categories));
  }

  private getUserData(): UserData | null {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      console.warn('User data not found');
      return null;
    }
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }
}
