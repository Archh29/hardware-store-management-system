export interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  costPrice: number;
  pricingType: 'fixed' | 'weight-based';
  
  // For fixed-price products
  sellingPrice?: number;
  quantity?: number;
  reorderLevel?: number;
  
  // For weight-based products
  pricePerKg?: number;
  totalWeightKg?: number;
  minWeightKg?: number;
  
  brand?: string;
  lastUpdated: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  pricingType?: 'fixed' | 'weight-based';
  weightKg?: number; // For weight-based products
}

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mixed';
  cashAmount?: number;
  cardAmount?: number;
  date: string;
  processedBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager';
  active: boolean;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  quantityChange: number;
  reason: string;
  adjustedBy: string;
  date: string;
}

export type UserRole = 'admin' | 'cashier' | 'manager';
