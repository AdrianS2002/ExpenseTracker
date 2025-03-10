import { Component, inject } from '@angular/core';
import { SummaryComponent } from "../summary/summary.component";
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SummaryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  router = inject(Router);
  authServices = inject(AuthService);

  navigateToExpenses(): void {
    this.router.navigate(['/expenses']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }
}
