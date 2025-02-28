import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() isActive = false;     // Bound by the parent: [isActive]="isSidebarOpen"
  @Output() closeSidebar = new EventEmitter<void>(); // To request closing the sidebar

  isLoggedIn = false;
  userEmail = '';
  private subscription: Subscription;

  constructor(private authService: AuthService) {
    // Listen for user changes
    this.subscription = this.authService.user.subscribe((user: any) => {
      console.log('Sidebar user:', user);
      this.isLoggedIn = !!user;
      this.userEmail = user && user.emaiL ? user.emaiL : 'No email available';
    });
  }

  onLinkClick(): void {
    this.closeSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.closeSidebar.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
