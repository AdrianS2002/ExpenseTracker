import { Component, OnInit } from '@angular/core';
import { Category } from '../database/models/category.model';
import { DatabaseService } from '../database/databse.service';
import { MatIconModule } from '@angular/material/icon';
// ng add @angular/material

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';
  newCategoryIcon: string = '';
  newCategoryColor: string = '';
  editCategoryId: string | null = null;
  updatedCategoryName: string = '';
  updatedCategoryIcon: string = '';
  updatedCategoryColor: string = '';

  icons: Record<string, string> = {};
  colors: Record<string, string> = {};

  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadIcons();
    this.loadColors();
  }

  loadCategories(): void {
    const userId = 'your-user-id'; // schimbat cu user -ul curent
    this.dbService.getCategories(userId).subscribe((categories) => {
      this.categories = categories;
    });
  }

  loadIcons(): void {
    this.dbService.getIcons().subscribe((icons) => {
      this.icons = icons;
    });
  }

  loadColors(): void {
    this.dbService.getColors().subscribe((colors) => {
      this.colors = colors;
    });
  }

  addCategory(): void {
    if (!this.newCategoryName || !this.newCategoryIcon || !this.newCategoryColor) {
      return;
    }

    const userId = 'your-user-id';
    const newCategory: Category = {
      name: this.newCategoryName,
      icon: this.newCategoryIcon,
      color: this.newCategoryColor
    };

    this.dbService.addCategory(userId, newCategory).subscribe(() => {
      this.newCategoryName = '';
      this.newCategoryIcon = '';
      this.newCategoryColor = '';
      this.loadCategories();
    });
  }

  startEdit(category: Category): void {
    this.editCategoryId = category.id ?? null;
    this.updatedCategoryName = category.name;
    this.updatedCategoryIcon = category.icon;
    this.updatedCategoryColor = category.color;
  }

  updateCategory(): void {
    if (this.editCategoryId) {
      const userId = 'your-user-id';
      const updatedCategory: Partial<Category> = {
        name: this.updatedCategoryName,
        icon: this.updatedCategoryIcon,
        color: this.updatedCategoryColor
      };
  
      this.dbService.updateCategory(userId, this.editCategoryId, updatedCategory).subscribe(() => {
        this.editCategoryId = null;
        this.updatedCategoryName = '';
        this.updatedCategoryIcon = '';
        this.updatedCategoryColor = '';
        this.loadCategories();
      });
    }
  }

  deleteCategory(categoryId: string): void {
    const userId = 'your-user-id';
    this.dbService.deleteCategory(userId, categoryId).subscribe(() => {
      this.loadCategories();
    });
  }
}
