import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DealService } from '@core/services/deal.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatError, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
    MatError,
    MatPrefix,
    MatSuffix
  ],
  templateUrl: './deal-form.component.html',
  styleUrl: './deal-form.component.scss'
})
export class DealFormComponent implements OnInit, OnDestroy {
  @Output() dealAdded = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private dealService = inject(DealService);
  private destroy$ = new Subject<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    purchasePrice: [null as number | null, [Validators.required, Validators.min(1)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    noi: [null as number | null, [Validators.required, Validators.min(0)]]
  });

  previewCapRate: number | null = null;
  isSubmitting = false;

  get nameCtrl() { return this.form.get('name')!; }
  get priceCtrl() { return this.form.get('purchasePrice')!; }
  get addressCtrl() { return this.form.get('address')!; }
  get noiCtrl() { return this.form.get('noi')!; }

  get capRateStatus(): 'low' | 'healthy' | 'high' | null {
    if (this.previewCapRate === null) return null;
    if (this.previewCapRate < 5) return 'low';
    if (this.previewCapRate <= 12) return 'healthy';
    return 'high';
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ purchasePrice, noi }) => {
        if (purchasePrice && purchasePrice > 0 && noi != null && noi >= 0) {
          this.previewCapRate = parseFloat(((noi / purchasePrice) * 100).toFixed(2));
        } else {
          this.previewCapRate = null;
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, purchasePrice, address, noi } = this.form.value;
    this.isSubmitting = true;

    this.dealService.addDeal({
      name: name!,
      purchasePrice: purchasePrice!,
      address: address!,
      noi: noi!
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dealAdded.emit();
          this.form.reset();
          this.previewCapRate = null;
          this.isSubmitting = false;
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
  }

  onCancel(): void {
    this.form.reset();
    this.previewCapRate = null;
    this.cancelled.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
