export interface Deal {
  id: string;
  name: string;
  purchasePrice: number;
  address: string;
  noi: number;
  capRate: number; // computed: NOI / purchasePrice
  createdAt: Date;
}

export type CreateDealDto = Omit<Deal, 'id' | 'capRate' | 'createdAt'>;

export interface DealFilters {
  name: string;
  purchasePriceMin: number | null;
  purchasePriceMax: number | null;
}

export const DEFAULT_FILTERS: DealFilters = {
  name: '',
  purchasePriceMin: null,
  purchasePriceMax: null
};
