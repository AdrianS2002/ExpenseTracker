// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpensesTrackerComponent } from './expenses-tracker/expenses-tracker.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ExpensesTrackerComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ExpenseTracker';

  isSidebarOpen = false;

  toggleSidebar() {
    console.log('sidbar open')
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
