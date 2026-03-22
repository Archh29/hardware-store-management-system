'use client';

import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Package, DollarSign, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { products, sales } = useStore();
  const { user } = useAuth();

  const lowStockItems = products.filter(p => p.quantity <= p.reorderLevel);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
  
  const todaySales = sales.filter(s => {
    const saleDate = new Date(s.date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });
  
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  const recentSales = sales.slice(0, 5);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {user?.name}! Here's what's happening with your store.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Package}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Today's Revenue"
          value={`$${todayRevenue.toFixed(2)}`}
          icon={DollarSign}
          iconColor="bg-green-500"
          trend={{ value: `${todaySales.length} sales`, isPositive: true }}
        />
        <StatCard
          title="Total Sales"
          value={sales.length}
          icon={ShoppingCart}
          iconColor="bg-purple-500"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems.length}
          icon={AlertTriangle}
          iconColor="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" />
              Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">{sale.id}</p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {format(new Date(sale.date), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 text-sm md:text-base">${sale.total.toFixed(2)}</p>
                    <p className="text-xs md:text-sm text-gray-500">{sale.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length === 0 ? (
                <p className="text-gray-500 text-sm">All items are well stocked.</p>
              ) : (
                lowStockItems.map((product) => (
                  <div key={product.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="danger">
                        {product.quantity} left
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Reorder at {product.reorderLevel}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    ${totalInventoryValue.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Items in Stock</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    {products.reduce((sum, p) => sum + p.quantity, 0)}
                  </p>
                </div>
                <Package className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
