import { Component, inject } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  categoryService = inject(CategoriesService);

  categoryForm = new FormGroup({
       name: new FormControl('', Validators.required)
 });

 showForm = false;

    onSubmit() {
      console.log("Form values:", this.categoryForm.value);

      this.categoryService.addCategory(this.categoryForm.value.name!);
      this.categoryForm.reset();
      this.categoryForm.markAsPristine();
      this.categoryForm.markAsUntouched();
      this.showForm = false;
    }
} 
