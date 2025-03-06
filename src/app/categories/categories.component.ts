import { Component, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryListComponent } from "./category-list/category-list.component";
import { AddCategoryComponent } from "./add-category/add-category.component";


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryListComponent, AddCategoryComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent{
  selectedCategory: { id: string; name: string } | null = null;

  openEditDialog(category: { id: string; name: string }) {
    this.selectedCategory = category;
  }

  closeEditDialog() {
    this.selectedCategory = null;
  }
}
