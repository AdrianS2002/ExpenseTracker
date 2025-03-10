import { Component, inject } from '@angular/core';
import { SummaryComponent } from "../summary/summary.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SummaryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  router = inject(Router);

  navigateToExpenses(): void {
    this.router.navigate(['/expenses']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }
}
