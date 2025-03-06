import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CategoriesService } from '../../categories.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
   categoryService = inject(CategoriesService);
  
   @Input() id: string = '';
   @Input() name: string = '';

   @Output() editCategory = new EventEmitter<{ id: string; name: string }>();

   onEdit() {
       this.editCategory.emit({ id: this.id, name: this.name });
   }
}
