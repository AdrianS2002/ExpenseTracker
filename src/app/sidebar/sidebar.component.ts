import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

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
  private subscription: Subscription;

  constructor(private authService: AuthService) {
    this.subscription = this.authService.user.subscribe((user: any) => {
      this.isLoggedIn = !!user;
    });
  }

  toggleSidebar(): void {
    this.isActive = !this.isActive;
  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }
}
