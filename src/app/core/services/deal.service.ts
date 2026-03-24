import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { CreateDealDto, Deal, DealFilters, DEFAULT_FILTERS } from '../models';
import { v4 as uuid } from '../utils/uuid.util';

const MOCK_DEALS: Deal[] = [
  {
    id: uuid(),
    name: 'Sunset Boulevard Office Complex',
    purchasePrice: 4_200_000,
    address: '1234 Sunset Blvd, Los Angeles, CA 90028',
    noi: 378_000,
    capRate: 9.0,
    createdAt: new Date('2024-01-15')
  },
  {
    id: uuid(),
    name: 'Downtown Seattle Retail Hub',
    purchasePrice: 6_800_000,
    address: '500 Pine Street, Seattle, WA 98101',
    noi: 476_000,
    capRate: 7.0,
    createdAt: new Date('2024-02-20')
  },
  {
    id: uuid(),
    name: 'Miami Beach Mixed Use',
    purchasePrice: 3_100_000,
    address: '820 Collins Ave, Miami Beach, FL 33139',
    noi: 248_000,
    capRate: 8.0,
    createdAt: new Date('2024-03-10')
  },
  {
    id: uuid(),
    name: 'Austin Tech Park',
    purchasePrice: 9_500_000,
    address: '2200 Domain Blvd, Austin, TX 78758',
    noi: 950_000,
    capRate: 10.0,
    createdAt: new Date('2024-04-05')
  },
  {
    id: uuid(),
    name: 'Chicago Warehouse District',
    purchasePrice: 2_750_000,
    address: '321 N Morgan St, Chicago, IL 60607',
    noi: 192_500,
    capRate: 7.0,
    createdAt: new Date('2024-05-18')
  }
];

@Injectable({ providedIn: 'root' })
export class DealService {
  private readonly _deals$ = new BehaviorSubject<Deal[]>(MOCK_DEALS);
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

  addDeal(dto: CreateDealDto): void {
    const capRate = dto.purchasePrice > 0
      ? parseFloat(((dto.noi / dto.purchasePrice) * 100).toFixed(2))
      : 0;

    const newDeal: Deal = {
      ...dto,
      id: uuid(),
      capRate,
      createdAt: new Date()
    };

    this._deals$.next([...this._deals$.value, newDeal]);
  }

  removeDeal(id: string): void {
    this._deals$.next(this._deals$.value.filter(d => d.id !== id));
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
