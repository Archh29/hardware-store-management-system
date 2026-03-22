'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Sale, User, StockAdjustment } from '@/types';
import { mockProducts, mockSales, mockUsers, mockStockAdjustments } from '@/lib/mockData';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  users: User[];
  stockAdjustments: StockAdjustment[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Sale) => void;
  addStockAdjustment: (adjustment: StockAdjustment) => void;
  updateStock: (productId: string, quantityChange: number) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);

  useEffect(() => {
    // Force refresh with new mock data (includes weight-based products)
    // Clear old localStorage to show new features
    localStorage.removeItem('products');
    localStorage.removeItem('sales');
    localStorage.removeItem('users');
    localStorage.removeItem('stockAdjustments');
    
    setProducts(mockProducts);
    setSales(mockSales);
    setUsers(mockUsers);
    setStockAdjustments(mockStockAdjustments);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('stockAdjustments', JSON.stringify(stockAdjustments));
  }, [stockAdjustments]);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct, lastUpdated: new Date().toISOString() } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addSale = (sale: Sale) => {
    setSales([sale, ...sales]);
    sale.items.forEach(item => {
      updateStock(item.productId, -item.quantity);
    });
  };

  const addStockAdjustment = (adjustment: StockAdjustment) => {
    setStockAdjustments([adjustment, ...stockAdjustments]);
    updateStock(adjustment.productId, adjustment.quantityChange);
  };

  const updateStock = (productId: string, quantityChange: number) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        if (p.pricingType === 'weight-based') {
          // For weight-based products, update totalWeightKg
          return { 
            ...p, 
            totalWeightKg: (p.totalWeightKg || 0) + quantityChange, 
            lastUpdated: new Date().toISOString() 
          };
        } else {
          // For fixed-price products, update quantity
          return { 
            ...p, 
            quantity: (p.quantity || 0) + quantityChange, 
            lastUpdated: new Date().toISOString() 
          };
        }
      }
      return p;
    }));
  };

  const addUser = (user: User) => {
    setUsers([...users, user]);
  };

  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updatedUser } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        users,
        stockAdjustments,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        addStockAdjustment,
        updateStock,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
