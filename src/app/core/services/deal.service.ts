import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { environment } from '@env/environment';
import { CreateDealDto, Deal, DealFilters, DEFAULT_FILTERS } from '../models';

@Injectable({ providedIn: 'root' })
export class DealService {
  private http = inject(HttpClient);

  private readonly _deals$ = new BehaviorSubject<Deal[]>([]);
  private readonly _filters$ = new BehaviorSubject<DealFilters>(DEFAULT_FILTERS);
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);

  readonly deals$: Observable<Deal[]> = this._deals$.asObservable();
  readonly filters$: Observable<DealFilters> = this._filters$.asObservable();
  readonly isLoading$: Observable<boolean> = this._isLoading$.asObservable();

  readonly filteredDeals$: Observable<Deal[]> = combineLatest([
    this._deals$,
    this._filters$
  ]).pipe(
    map(([deals, filters]) => this.applyFilters(deals, filters))
  );

  get currentFilters(): DealFilters {
    return this._filters$.value;
  }

  loadDeals(): Observable<Deal[]> {
    this._isLoading$.next(true);
    return this.http.get<Deal[]>(`${environment.apiUrl}/deals`).pipe(
      tap(deals => {
        this._deals$.next(deals);
        this._isLoading$.next(false);
      }),
      map(deals => deals)
    );
  }

  addDeal(dto: CreateDealDto): Observable<Deal> {
    const capRate = dto.purchasePrice > 0
      ? parseFloat(((dto.noi / dto.purchasePrice) * 100).toFixed(2))
      : 0;

    const newDeal = {
      ...dto,
      capRate,
      createdAt: new Date().toISOString()
    };

    return this.http.post<Deal>(`${environment.apiUrl}/deals`, newDeal).pipe(
      tap(deal => {
        this._deals$.next([...this._deals$.value, deal]);
      })
    );
  }

  removeDeal(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/deals/${id}`).pipe(
      tap(() => {
        this._deals$.next(this._deals$.value.filter(d => d.id !== id));
      })
    );
  }

  updateFilters(partial: Partial<DealFilters>): void {
    this._filters$.next({ ...this._filters$.value, ...partial });
  }

  resetFilters(): void {
    this._filters$.next(DEFAULT_FILTERS);
  }

  private applyFilters(deals: Deal[], filters: DealFilters): Deal[] {
    return deals.filter(deal => {
      const nameMatch = !filters.name ||
        deal.name.toLowerCase().includes(filters.name.toLowerCase());

      const minMatch = filters.purchasePriceMin === null ||
        deal.purchasePrice >= filters.purchasePriceMin;

      const maxMatch = filters.purchasePriceMax === null ||
        deal.purchasePrice <= filters.purchasePriceMax;

      return nameMatch && minMatch && maxMatch;
    });
  }
}
