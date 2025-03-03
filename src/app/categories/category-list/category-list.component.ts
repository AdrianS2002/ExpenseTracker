import { Component, inject } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { CategoryComponent } from "./category/category.component";
import { EditCategoryComponent } from '../edit-category/edit-category.component'; // Import the EditCategoryComponent
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CategoryComponent, EditCategoryComponent, CommonModule], // Include it in the imports
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  categoryService = inject(CategoriesService);
  selectedCategory: { id: string; name: string } | null = null;

  openEditDialog(category: { id: string; name: string }) {
    this.selectedCategory = category;
  }

  closeEditDialog() {
    this.selectedCategory = null;
  }
}
