import { Component } from '@angular/core';
import { RouterOutlet, provideRouter } from '@angular/router';
import { ExpensesTrackerComponent } from './expenses-tracker/expenses-tracker.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { routes } from './app.routes';

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
}

// In main.ts, bootstrap with your router configuration:
import { bootstrapApplication } from '@angular/platform-browser';
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
