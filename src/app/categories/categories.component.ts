import { Component, OnInit, inject } from '@angular/core';
import { Category } from '../database/models/category.model';
import { DatabaseService } from '../database/databse.service';
import { Auth, user, User } from '@angular/fire/auth';
import { Observable, first, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';

  userId$!: Observable<string | null>;

  private auth = inject(Auth);

  constructor(private dbService: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.userId$ = user(this.auth).pipe(map((firebaseUser: User | null) => firebaseUser?.uid ?? null));

    this.userId$.subscribe((uid) => {
      if (!uid) {
        console.log('User is not authenticated. Redirecting to login...');
        this.router.navigate(['/auth']);
        return;
      }

      this.loadCategories(uid);
    });

  }
  

  loadCategories(userId: string): void {
    this.dbService.getCategories(userId).subscribe({
      next: (categories) => {
        console.log("Categories retrieved:", categories);
        this.categories = categories;
      },
      error: (err) => console.error("Failed to load categories:", err)
    });
  }
  

  addCategory(): void {
    this.userId$.pipe(first()).subscribe((userId) => {
      if (!userId || !this.newCategoryName) {
        console.error("User ID or category name is missing!");
        return;
      }
  
      const newCategory = { name: this.newCategoryName }; 
  
      this.dbService.addCategory(userId, newCategory).subscribe({
        next: (categoryId) => {
          console.log("Category added with ID:", categoryId);
          this.newCategoryName = '';
          this.loadCategories(userId);
        },
        error: (err) => console.error("Error adding category:", err)
      });
    });
  }
  

  deleteCategory(categoryId: string): void {
    this.userId$.pipe(first()).subscribe((userId) => {
      if (!userId) {
        console.error("User ID is missing!");
        return;
      }
  
      this.dbService.deleteCategory(userId, categoryId).subscribe({
        next: () => {
          console.log(`Category ${categoryId} deleted successfully!`);
          this.loadCategories(userId);
        },
        error: (err) => console.error("Error deleting category:", err)
      });
    });
  }
  

  trackByCategory(index: number, category: Category): string {
    return category.id ?? index.toString();
  }
}
