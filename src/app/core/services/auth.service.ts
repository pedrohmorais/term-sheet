import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from '@environments';
import { AuthState, LoginCredentials, User } from '../models';

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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginCredentials): Observable<User> {
    this._state$.next({ ...this._state$.value, isLoading: true, error: null });

    return this.http.post<User>(
      `${environment.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(user => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        this._state$.next({ user, isAuthenticated: true, isLoading: false, error: null });
        this.isAuthenticated$.next(true);
        this.currentUser$.next(user);
      }),
      catchError(err => {
        const errorMessage = err.error?.error || err.message || 'Login failed';
        this._state$.next({ user: null, isAuthenticated: false, isLoading: false, error: errorMessage });
        throw err;
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
