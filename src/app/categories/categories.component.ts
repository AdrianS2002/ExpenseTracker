import { Component, OnInit, inject, input } from '@angular/core';
import { Category } from '../database/models/category.model';
import { DatabaseService } from '../database/databse.service';
import { Auth, user, User } from '@angular/fire/auth';
import { Observable, first, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from './categories.service';
import { CategoryListComponent } from "./category-list/category-list.component";
import { AddCategoryComponent } from "./add-category/add-category.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryListComponent, AddCategoryComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent{

}
