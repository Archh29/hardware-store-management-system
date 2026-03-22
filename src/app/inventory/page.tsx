'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit, Trash2, Search, AlertCircle, Package } from 'lucide-react';
import { Product } from '@/types';
import { categories, suppliers } from '@/lib/mockData';

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct, addStockAdjustment } = useStore();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'in-stock'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);
  const [quantityChangeReason, setQuantityChangeReason] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      if (p.pricingType === 'weight-based') {
        matchesStock = (p.totalWeightKg || 0) <= (p.minWeightKg || 0) && (p.totalWeightKg || 0) > 0;
      } else {
        matchesStock = (p.quantity || 0) <= (p.reorderLevel || 0) && (p.quantity || 0) > 0;
      }
    } else if (stockFilter === 'out') {
      if (p.pricingType === 'weight-based') {
        matchesStock = (p.totalWeightKg || 0) === 0;
      } else {
        matchesStock = (p.quantity || 0) === 0;
      }
    } else if (stockFilter === 'in-stock') {
      if (p.pricingType === 'weight-based') {
        matchesStock = (p.totalWeightKg || 0) > (p.minWeightKg || 0);
      } else {
        matchesStock = (p.quantity || 0) > (p.reorderLevel || 0);
      }
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockProducts = products.filter(p => {
    if (p.pricingType === 'weight-based') {
      return (p.totalWeightKg || 0) <= (p.minWeightKg || 0) && (p.totalWeightKg || 0) > 0;
    } else {
      return (p.quantity || 0) <= (p.reorderLevel || 0) && (p.quantity || 0) > 0;
    }
  });
  
  const outOfStockProducts = products.filter(p => {
    if (p.pricingType === 'weight-based') {
      return (p.totalWeightKg || 0) === 0;
    } else {
      return (p.quantity || 0) === 0;
    }
  });

  const handleAddProduct = () => {
    const pricingType = formData.pricingType || 'fixed';
    
    // Validate common fields
    if (!formData.name || !formData.category || !formData.costPrice || !pricingType) {
      showError('Validation Error', 'Please fill in all required fields');
      return;
    }
    
    // Validate pricing type specific fields
    if (pricingType === 'weight-based') {
      if (!formData.pricePerKg || !formData.totalWeightKg) {
        showError('Validation Error', 'Please fill in price per kg and total weight');
        return;
      }
    } else {
      if (!formData.sellingPrice || !formData.quantity) {
        showError('Validation Error', 'Please fill in selling price and quantity');
        return;
      }
    }

    const newProduct: Product = {
      id: `P${String(products.length + 1).padStart(3, '0')}`,
      name: formData.name!,
      category: formData.category!,
      supplier: formData.supplier || 'Unknown',
      costPrice: Number(formData.costPrice),
      pricingType: pricingType as 'fixed' | 'weight-based',
      brand: formData.brand,
      lastUpdated: new Date().toISOString(),
    };
    
    // Add pricing type specific fields
    if (pricingType === 'weight-based') {
      newProduct.pricePerKg = Number(formData.pricePerKg);
      newProduct.totalWeightKg = Number(formData.totalWeightKg);
      newProduct.minWeightKg = Number(formData.minWeightKg || 5);
    } else {
      newProduct.sellingPrice = Number(formData.sellingPrice);
      newProduct.quantity = Number(formData.quantity);
      newProduct.reorderLevel = Number(formData.reorderLevel || 10);
    }

    addProduct(newProduct);
    showSuccess('Product Added', `${newProduct.name} has been added to inventory`);
    setShowAddModal(false);
    setFormData({});
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;
    
    const newQuantity = formData.quantity !== undefined ? Number(formData.quantity) : selectedProduct.quantity;
    const quantityChanged = newQuantity !== originalQuantity;
    
    // If quantity changed but no reason provided, show error
    if (quantityChanged && !quantityChangeReason.trim()) {
      showError('Reason Required', 'Please provide a reason for the quantity change');
      return;
    }
    
    // Update the product
    updateProduct(selectedProduct.id, {
      ...formData,
      costPrice: formData.costPrice ? Number(formData.costPrice) : selectedProduct.costPrice,
      sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice) : selectedProduct.sellingPrice,
      quantity: newQuantity,
      reorderLevel: formData.reorderLevel !== undefined ? Number(formData.reorderLevel) : selectedProduct.reorderLevel,
    });
    
    // If quantity changed, automatically create stock adjustment record
    if (quantityChanged) {
      const quantityChange = newQuantity - originalQuantity;
      addStockAdjustment({
        id: `A${String(Math.random()).substring(2, 8)}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantityChange: quantityChange,
        reason: quantityChangeReason,
        adjustedBy: user?.name || 'Unknown',
        date: new Date().toISOString(),
      });
      showSuccess('Product Updated', `${selectedProduct.name} updated. Stock adjusted by ${quantityChange > 0 ? '+' : ''}${quantityChange}`);
    } else {
      showSuccess('Product Updated', `${selectedProduct.name} has been updated`);
    }
    
    setShowEditModal(false);
    setSelectedProduct(null);
    setFormData({});
    setQuantityChangeReason('');
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setOriginalQuantity(product.quantity);
    setQuantityChangeReason('');
    setShowEditModal(true);
  };

  const lowStockCount = products.filter(p => p.quantity <= p.reorderLevel).length;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Manage your product catalog and stock levels</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stock Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="mb-6 space-y-4">
          {outOfStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Out of Stock ({outOfStockProducts.length})</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setStockFilter('out')}
                  className="text-red-600 hover:text-red-800"
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {outOfStockProducts.slice(0, 6).map(product => (
                  <div key={product.id} className="text-sm text-red-700 bg-red-100 px-3 py-1 rounded">
                    {product.name} ({product.id})
                  </div>
                ))}
                {outOfStockProducts.length > 6 && (
                  <div className="text-sm text-red-600 px-3 py-1">
                    +{outOfStockProducts.length - 6} more
                  </div>
                )}
              </div>
            </div>
          )}

          {lowStockProducts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Low Stock ({lowStockProducts.length})</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setStockFilter('low')}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {lowStockProducts.slice(0, 6).map(product => (
                  <div key={product.id} className="text-sm text-yellow-700 bg-yellow-100 px-3 py-1 rounded flex justify-between">
                    <span>{product.name} ({product.id})</span>
                    <span className="font-medium">{product.quantity} left</span>
                  </div>
                ))}
                {lowStockProducts.length > 6 && (
                  <div className="text-sm text-yellow-600 px-3 py-1">
                    +{lowStockProducts.length - 6} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:w-auto">
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...categories.map(cat => ({ value: cat, label: cat }))
                  ]}
                />
                <Select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  options={[
                    { value: 'all', label: 'All Stock Levels' },
                    { value: 'in-stock', label: 'In Stock' },
                    { value: 'low', label: 'Low Stock' },
                    { value: 'out', label: 'Out of Stock' }
                  ]}
                />
              </div>
            </div>
            
            {/* Filter Summary */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              {stockFilter !== 'all' && (
                <Badge variant="info" className="cursor-pointer" onClick={() => setStockFilter('all')}>
                  {stockFilter === 'low' ? 'Low Stock' : stockFilter === 'out' ? 'Out of Stock' : 'In Stock'} ✕
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge variant="info" className="cursor-pointer" onClick={() => setCategoryFilter('all')}>
                  {categoryFilter} ✕
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="info" className="cursor-pointer" onClick={() => setSearchTerm('')}>
                  "{searchTerm}" ✕
                </Badge>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Supplier</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Cost Price</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const isLowStock = product.pricingType === 'weight-based' 
                    ? (product.totalWeightKg || 0) <= (product.minWeightKg || 0)
                    : (product.quantity || 0) <= (product.reorderLevel || 0);
                  
                  const stockPercentage = product.pricingType === 'weight-based'
                    ? ((product.totalWeightKg || 0) / ((product.minWeightKg || 1) * 3)) * 100
                    : ((product.quantity || 0) / ((product.reorderLevel || 1) * 3)) * 100;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.id}</div>
                            <div className="text-xs text-gray-400 sm:hidden">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {product.category}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {product.supplier}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        ${product.costPrice.toFixed(2)}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.pricingType === 'weight-based' 
                          ? `$${(product.pricePerKg || 0).toFixed(2)}/kg`
                          : `$${(product.sellingPrice || 0).toFixed(2)}`
                        }
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 mr-2">
                            {product.pricingType === 'weight-based' 
                              ? `${product.totalWeightKg || 0}kg`
                              : `${product.quantity || 0}`
                            }
                          </div>
                          <div className="w-12 md:w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                stockPercentage > 50 ? 'bg-green-500' : 
                                stockPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                        {product.pricingType === 'weight-based' && (
                          <div className="text-xs text-gray-500 mt-1">
                            ${(product.pricePerKg || 0).toFixed(2)}/kg
                          </div>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {isLowStock ? (
                          <Badge variant="danger">
                            {product.pricingType === 'weight-based' ? 'Low Weight' : 'Low Stock'}
                          </Badge>
                        ) : (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openEditModal(product)}>
                            <Edit className="w-4 h-4 md:mr-1" />
                            <span className="hidden md:inline">Edit</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                                deleteProduct(product.id);
                                showSuccess('Product Deleted', `${product.name} has been removed from inventory`);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormData({});
        }}
        title="Add New Product"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Product Name *"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category *"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: '', label: 'Select Category' },
                ...categories.map(cat => ({ value: cat, label: cat }))
              ]}
            />
            <Input
              label="Supplier"
              value={formData.supplier || ''}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Enter supplier name"
            />
          </div>

          {/* Pricing Type Selector */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Product Type</h4>
            <Select
              label="How is this product sold? *"
              value={formData.pricingType || 'fixed'}
              onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
              options={[
                { value: 'fixed', label: '🔢 Fixed Price (per piece/unit)' },
                { value: 'weight-based', label: '⚖️ Weight-based (per kilogram)' }
              ]}
            />
            <p className="text-sm text-blue-700 mt-2">
              {formData.pricingType === 'weight-based' 
                ? 'Choose this for bulk materials like nails, gravel, cement, wire, etc.'
                : 'Choose this for individual items like tools, screws, paint cans, etc.'
              }
            </p>
          </div>

          <Input
            label="Cost Price *"
            type="number"
            step="0.01"
            value={formData.costPrice || ''}
            onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })}
            placeholder="0.00"
          />

          {/* Conditional Fields Based on Pricing Type */}
          {formData.pricingType === 'weight-based' ? (
            // Weight-based product fields
            <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 flex items-center gap-2">
                ⚖️ Weight-Based Product Settings
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price per Kilogram *"
                  type="number"
                  step="0.01"
                  value={formData.pricePerKg || ''}
                  onChange={(e) => setFormData({ ...formData, pricePerKg: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
                <Input
                  label="Total Weight in Stock (kg) *"
                  type="number"
                  step="0.1"
                  value={formData.totalWeightKg || ''}
                  onChange={(e) => setFormData({ ...formData, totalWeightKg: parseFloat(e.target.value) })}
                  placeholder="0.0"
                />
              </div>
              <Input
                label="Minimum Weight Threshold (kg)"
                type="number"
                step="0.1"
                value={formData.minWeightKg || ''}
                onChange={(e) => setFormData({ ...formData, minWeightKg: parseFloat(e.target.value) })}
                placeholder="5.0"
              />
            </div>
          ) : (
            // Fixed-price product fields
            <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-900 flex items-center gap-2">
                🔢 Fixed-Price Product Settings
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Selling Price *"
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice || ''}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
                <Input
                  label="Quantity in Stock *"
                  type="number"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <Input
                label="Reorder Level (units)"
                type="number"
                value={formData.reorderLevel || ''}
                onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                placeholder="10"
              />
            </div>
          )}

          <Input
            label="Brand"
            value={formData.brand || ''}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Enter brand name"
          />
        </div>
      </Modal>
    </div>
  );
}
