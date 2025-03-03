import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent {
  categoryService = inject(CategoriesService);

  @Input() category: { id: string; name: string } | null = null;
  @Output() closeDialog = new EventEmitter<void>();

  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  ngOnChanges() {
    if (this.category) {
      this.categoryForm.patchValue({ name: this.category.name });
    }
  }

  onSubmit() {
    if (this.categoryForm.valid && this.category) {
      console.log('Updated Category:', this.categoryForm.value);
      this.categoryService.updateCategory(this.category.id, this.categoryForm.value.name!);
      this.closeDialog.emit();
    }
  }

  onCancel() {
    this.closeDialog.emit();
  }
}
