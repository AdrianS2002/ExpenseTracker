import { Component, inject } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { CategoryComponent } from "./category/category.component";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CategoryComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  catgeoryService = inject(CategoriesService);
}
