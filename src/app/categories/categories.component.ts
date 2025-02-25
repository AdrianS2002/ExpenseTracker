import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { DatabaseService } from '../database/databse.service';
import { AuthService } from '../auth/auth.service';
import { Category } from '../database/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  newCategoryName = '';

  private userSub?: Subscription;
  private currentUserId: string | null = null;

  constructor(
    private dbService: DatabaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the AuthService user BehaviorSubject
    this.userSub = this.authService.user.subscribe((user) => {
      if (!user) {
        console.log('User is not authenticated. Redirecting to login...');
        this.router.navigate(['/auth']);
        return;
      }
      // user.id must be valid if logged in
      this.currentUserId = user.id;
      if (this.currentUserId) {
        this.loadCategories(this.currentUserId as string);
      }
    });
  }

  loadCategories(userId: string): void {
    this.dbService.getCategories(userId).subscribe({
      next: (categories) => {
        console.log('Categories retrieved:', categories);
        this.categories = categories;
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  addCategory(): void {
    if (!this.currentUserId || !this.newCategoryName.trim()) {
      console.error('User ID or category name is missing!');
      return;
    }

    const newCategory = { name: this.newCategoryName.trim() };
    this.dbService.addCategory(this.currentUserId, newCategory).subscribe({
      next: (categoryId) => {
        console.log('Category added with ID:', categoryId);
        this.newCategoryName = '';
        this.loadCategories(this.currentUserId);
      },
      error: (err) => console.error('Error adding category:', err)
    });
  }

  deleteCategory(categoryId: string): void {
    if (!this.currentUserId) {
      console.error('User ID is missing!');
      return;
    }

    this.dbService.deleteCategory(this.currentUserId, categoryId).subscribe({
      next: () => {
        console.log(`Category ${categoryId} deleted successfully!`);
        this.loadCategories(this.currentUserId);
      },
      error: (err) => console.error('Error deleting category:', err)
    });
  }

  trackByCategory(index: number, category: Category): string {
    return category.id ?? index.toString();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
