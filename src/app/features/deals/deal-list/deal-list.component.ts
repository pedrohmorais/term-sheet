import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealService } from '@core/services/deal.service';
import { DealFiltersComponent } from '../deal-filters/deal-filters.component';
import { DealFormComponent } from '../deal-form/deal-form.component';
import { HighlightTextComponent } from '@shared/components/highlight-text/highlight-text.component';
import { UsdCurrencyPipe } from '@shared/pipes/usd-currency.pipe';
import { CapRateStatusPipe } from '@shared/pipes/cap-rate-status.pipe';
import { map } from 'rxjs';
import { MatHeaderRow, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatCellDef, MatColumnDef, MatHeaderCell, MatCell, MatRow } from '@angular/material/table';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [
    CommonModule,
    DealFiltersComponent,
    DealFormComponent,
    HighlightTextComponent,
    UsdCurrencyPipe,
    CapRateStatusPipe,
    MatHeaderRow,
    MatTable,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatRow,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCard,
    MatTooltip
  ],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.scss'
})
export class DealListComponent implements OnInit {
  private dealService = inject(DealService);

  deals$ = this.dealService.filteredDeals$;
  filters$ = this.dealService.filters$;
  isLoading$ = this.dealService.isLoading$;
  totalCount$ = this.dealService.deals$.pipe(map(d => d.length));
  showForm = false;

  nameFilter$ = this.filters$.pipe(map(f => f.name));

  displayedColumns = ['name', 'address', 'purchasePrice', 'noi', 'capRate', 'actions'];

  ngOnInit(): void {
    this.dealService.loadDeals().subscribe();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onDealAdded(): void {
    this.showForm = false;
  }

  removeDeal(id: string): void {
    this.dealService.removeDeal(id).subscribe();
  }

  trackById(_: number, deal: { id: string }): string {
    return deal.id;
  }
}
