import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AuthState, LoginCredentials, User } from '../models';

const MOCK_USERS: Array<User & { password: string }> = [
  { id: '1', username: 'admin', name: 'Admin User', password: 'admin123' },
  { id: '2', username: 'demo', name: 'Demo User', password: 'demo123' }
];

const STORAGE_KEY = 'termsheet_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _state$ = new BehaviorSubject<AuthState>({
    user: this.loadUserFromStorage(),
    isAuthenticated: !!this.loadUserFromStorage(),
    isLoading: false,
    error: null
  });

  readonly state$: Observable<AuthState> = this._state$.asObservable();
  readonly isAuthenticated$ = new BehaviorSubject<boolean>(!!this.loadUserFromStorage());
  readonly currentUser$ = new BehaviorSubject<User | null>(this.loadUserFromStorage());

  constructor(private router: Router) {}

  login(credentials: LoginCredentials): Observable<User> {
    this._state$.next({ ...this._state$.value, isLoading: true, error: null });

    const user = MOCK_USERS.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => new Error('Invalid username or password')).pipe(
        tap({ error: (err) => {
          this._state$.next({ user: null, isAuthenticated: false, isLoading: false, error: err.message });
        }})
      );
    }

    const { password: _, ...safeUser } = user;

    return of(safeUser).pipe(
      delay(600),
      tap(u => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        this._state$.next({ user: u, isAuthenticated: true, isLoading: false, error: null });
        this.isAuthenticated$.next(true);
        this.currentUser$.next(u);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this._state$.next({ user: null, isAuthenticated: false, isLoading: false, error: null });
    this.isAuthenticated$.next(false);
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  private loadUserFromStorage(): User | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
