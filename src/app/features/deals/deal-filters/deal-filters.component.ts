import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { DealService } from '@core/services/deal.service';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-deal-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
    MatPrefix
  ],
  templateUrl: './deal-filters.component.html',
  styleUrl: './deal-filters.component.scss'
})
export class DealFiltersComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dealService = inject(DealService);
  private destroy$ = new Subject<void>();

  form = this.fb.group({
    name: [''],
    purchasePriceMin: [null as number | null],
    purchasePriceMax: [null as number | null]
  });

  get hasActiveFilters(): boolean {
    const { name, purchasePriceMin, purchasePriceMax } = this.form.value;
    return !!(name || purchasePriceMin != null || purchasePriceMax != null);
  }

  ngOnInit(): void {
    // Sync initial filters from service
    const current = this.dealService.currentFilters;
    this.form.patchValue(current, { emitEvent: false });

    // Reactively update filters with debounce on text input
    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.dealService.updateFilters({
        name: value.name ?? '',
        purchasePriceMin: value.purchasePriceMin ?? null,
        purchasePriceMax: value.purchasePriceMax ?? null
      });
    });
  }

  resetFilters(): void {
    this.form.reset({ name: '', purchasePriceMin: null, purchasePriceMax: null });
    this.dealService.resetFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
