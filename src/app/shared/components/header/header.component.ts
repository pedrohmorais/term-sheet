import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbar,
    MatButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <a routerLink="/deals" class="logo-link">
        <span class="logo-term">Term</span><span class="logo-sheet">Sheet</span>
      </a>
      <span class="spacer"></span>
      @if (auth.isAuthenticated$ | async) {
        <div class="user-section">
          <button mat-button [matMenuTriggerFor]="menu" class="user-button">
            <mat-icon>account_circle</mat-icon>
            {{ (auth.currentUser$ | async)?.name }}
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="auth.logout()">
              <mat-icon>logout</mat-icon>
              <span>Sign out</span>
            </button>
          </mat-menu>
        </div>
      }
    </mat-toolbar>
  `,
  styles: [`
    .app-toolbar {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 2rem;
      width: 100%;
    }

    .logo-link {
      font-size: 1.5rem;
      font-weight: 700;
      text-decoration: none;
      letter-spacing: -0.02em;
      color: inherit;
      text-transform: capitalize;

      &:hover {
        opacity: 0.8;
      }
    }

    .logo-term {
      font-weight: 300;
      letter-spacing: 0.05em;
    }

    .logo-sheet {
      font-weight: 700;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-section {
      display: flex;
      align-items: center;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-transform: none;
      font-size: 0.875rem;
    }
  `]
})
export class HeaderComponent {
  auth = inject(AuthService);
}
