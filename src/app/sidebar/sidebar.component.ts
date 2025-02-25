import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnDestroy {
  isActive = false;
  isLoggedIn = false;
  userEmail = '';
  private subscription: Subscription;

  constructor(private authService: AuthService) {
    this.subscription = this.authService.user.subscribe((user: any) => {
      this.isLoggedIn = !!user;
      this.userEmail = user ? user.email : '';
    });
  }

  toggleSidebar(): void {
    this.isActive = !this.isActive;
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
