import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <ng-container *ngIf="authService.isAuthenticated$ | async">
      <app-header />
    </ng-container>
    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 64px);
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
}
