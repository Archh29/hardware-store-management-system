'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, DollarSign, Package, ShoppingCart, Calendar, Users, Clock, AlertTriangle } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ReportsPage() {
  const { products, sales, stockAdjustments } = useStore();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');

  const filteredSales = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;

    switch (dateRange) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      default:
        return sales;
    }

    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return isWithinInterval(saleDate, { start, end });
    });
  }, [sales, dateRange]);

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => {
    const saleProfit = sale.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return itemSum;
      return itemSum + ((item.unitPrice - product.costPrice) * item.quantity);
    }, 0);
    return sum + saleProfit;
  }, 0);

  const totalItemsSold = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  const salesByDay = useMemo(() => {
    const dayMap = new Map<string, number>();
    filteredSales.forEach(sale => {
      const day = format(new Date(sale.date), 'MMM dd');
      dayMap.set(day, (dayMap.get(day) || 0) + sale.total);
    });
    return Array.from(dayMap.entries()).map(([day, total]) => ({ day, total }));
  }, [filteredSales]);

  const topSellingProducts = useMemo(() => {
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = productMap.get(item.productId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.subtotal;
        } else {
          productMap.set(item.productId, {
            name: item.productName,
            quantity: item.quantity,
            revenue: item.subtotal,
          });
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [filteredSales]);

  const salesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + item.subtotal);
        }
      });
    });

    return Array.from(categoryMap.entries()).map(([category, value]) => ({
      name: category,
      value: Math.round(value * 100) / 100,
    }));
  }, [filteredSales, products]);

  const inventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
  const lowStockCount = products.filter(p => p.quantity <= p.reorderLevel).length;

  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-500 mt-1">Track sales, profits, and inventory trends</p>
          </div>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'all', label: 'All Time' },
            ]}
            className="w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{filteredSales.length} sales</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${totalProfit.toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-1">{profitMargin}% margin</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Sold</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalItemsSold}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total units</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${inventoryValue.toFixed(2)}
                </p>
                <p className="text-xs text-red-600 mt-1">{lowStockCount} low stock</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {salesByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No sales data for this period
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {salesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: $${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No category data for this period
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topSellingProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topSellingProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#3b82f6" name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-500">
                No product sales data
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${product.revenue.toFixed(2)}</p>
                      <Badge variant="success">Revenue</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>End of Period Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Cash Collected</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                ${filteredSales
                  .filter(s => s.paymentMethod === 'cash')
                  .reduce((sum, s) => sum + s.total, 0)
                  .toFixed(2)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {filteredSales.filter(s => s.paymentMethod === 'cash').length} cash sales
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Card Payments</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                ${filteredSales
                  .filter(s => s.paymentMethod === 'card')
                  .reduce((sum, s) => sum + s.total, 0)
                  .toFixed(2)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {filteredSales.filter(s => s.paymentMethod === 'card').length} card sales
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Average Sale</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                ${filteredSales.length > 0 ? (totalRevenue / filteredSales.length).toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-purple-600 mt-1">Per transaction</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">Products in Stock</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {products.reduce((sum, p) => sum + p.quantity, 0)}
              </p>
              <p className="text-xs text-orange-600 mt-1">{products.length} product types</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Movement History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Stock Movement History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stockAdjustments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No stock adjustments recorded yet</p>
              <p className="text-sm">Stock changes will appear here when you edit product quantities</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjusted By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockAdjustments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 20)
                    .map((adjustment) => (
                    <tr key={adjustment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(adjustment.date), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{adjustment.productName}</div>
                        <div className="text-sm text-gray-500">{adjustment.productId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={adjustment.quantityChange > 0 ? 'success' : 'danger'}>
                          {adjustment.quantityChange > 0 ? '+' : ''}{adjustment.quantityChange}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {adjustment.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {adjustment.adjustedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {stockAdjustments.length > 20 && (
                <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 text-center">
                  Showing latest 20 adjustments of {stockAdjustments.length} total
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
