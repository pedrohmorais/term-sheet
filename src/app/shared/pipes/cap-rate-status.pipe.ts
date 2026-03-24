import { Pipe, PipeTransform } from '@angular/core';

export type CapRateStatus = 'low' | 'healthy' | 'high';

@Pipe({ name: 'capRateStatus', standalone: true })
export class CapRateStatusPipe implements PipeTransform {
  transform(capRate: number): CapRateStatus {
    if (capRate < 5) return 'low';
    if (capRate <= 12) return 'healthy';
    return 'high';
  }
}
