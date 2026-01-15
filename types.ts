export interface Sneaker {
  id: string;
  brand: string;
  model: string;
  colorway: string;
  size: number;
  price?: number; // Optional
  image?: string; // base64
  condition: 'Deadstock' | 'Used' | 'Beater';
  addedDate: string;
}

export type ViewState = 'COLLECTION' | 'ADD' | 'STATS';

export interface SneakerStats {
  totalPairs: number;
  totalValue: number;
  brandDistribution: { name: string; value: number }[];
}