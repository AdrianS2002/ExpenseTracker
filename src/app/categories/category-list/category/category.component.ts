import { Component, inject, input } from '@angular/core';
import { CategoriesService } from '../../categories.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
   catgeoryService = inject(CategoriesService);
  
      id = input<string>();
      name = input<string>();
}
