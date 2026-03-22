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
import { ShoppingCart, Trash2, Printer, CreditCard, DollarSign, Search, Scale } from 'lucide-react';
import { Sale, SaleItem } from '@/types';
import { format } from 'date-fns';
import { WeightCalculator } from '@/components/WeightCalculator';

export default function POSPage() {
  const { products, addSale } = useStore();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mixed'>('cash');
  const [cashAmount, setCashAmount] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [customer, setCustomer] = useState<{name: string, phone: string, email: string} | null>(null);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState(0);
  const [taxRate, setTaxRate] = useState(0.08); // 8% tax
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForm, setCustomerForm] = useState({name: '', phone: '', email: ''});

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // For weight-based products, don't add directly - they need weight calculation
    if (product.pricingType === 'weight-based') {
      showError('Weight Required', 'Please use the weight calculator for this product');
      return;
    }

    if ((product.quantity || 0) === 0) {
      showError('Out of Stock', 'This product is currently out of stock');
      return;
    }

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      if (existingItem.quantity >= (product.quantity || 0)) {
        showError('Stock Limit', 'Cannot add more than available stock');
        return;
      }
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.sellingPrice || 0,
        subtotal: product.sellingPrice || 0,
        pricingType: 'fixed',
      }]);
    }
    setSearchTerm('');
  };

  const addToCartByWeight = (productId: string, weightKg: number, totalPrice: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart([...cart, {
      productId: product.id,
      productName: product.name,
      quantity: 1, // Always 1 for weight-based items
      unitPrice: totalPrice,
      subtotal: totalPrice,
      pricingType: 'weight-based',
      weightKg: weightKg,
    }]);

    showSuccess('Added to Cart', `${weightKg}kg of ${product.name} added for $${totalPrice.toFixed(2)}`);
    setSearchTerm('');
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity > product.quantity) {
      showError('Stock Limit', 'Cannot exceed available stock');
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.unitPrice }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Calculate discount amount
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discountValue / 100) 
    : discountValue;
  
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * taxRate;
  const total = afterDiscount + taxAmount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      showError('Empty Cart', 'Please add items to cart before checkout');
      return;
    }

    if (paymentMethod === 'mixed' && (cashAmount + cardAmount !== total)) {
      showError('Payment Error', 'Cash and card amounts must equal the total');
      return;
    }

    const sale: Sale = {
      id: `S${String(Math.random()).substring(2, 8)}`,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      total,
      paymentMethod,
      cashAmount: paymentMethod === 'cash' ? total : (paymentMethod === 'mixed' ? cashAmount : undefined),
      cardAmount: paymentMethod === 'card' ? total : (paymentMethod === 'mixed' ? cardAmount : undefined),
      date: new Date().toISOString(),
      processedBy: user?.name || 'Unknown',
    };

    addSale(sale);
    setLastSale(sale);
    setShowReceipt(true);
    showSuccess('Sale Completed', `Sale ${sale.id} processed successfully`);
    
    setCart([]);
    setDiscountValue(0);
    setPaymentMethod('cash');
    setCashAmount(0);
    setCardAmount(0);
    setCustomer(null);
  };

  const addCustomer = () => {
    if (!customerForm.name.trim()) {
      showError('Customer Required', 'Please enter customer name');
      return;
    }
    setCustomer(customerForm);
    setShowCustomerModal(false);
    setCustomerForm({name: '', phone: '', email: ''});
    showSuccess('Customer Added', `${customerForm.name} added to sale`);
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    setDiscountValue(0);
    setCustomer(null);
    showSuccess('Cart Cleared', 'All items removed from cart');
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Point of Sale</h1>
            <p className="text-gray-500 mt-1">Process sales and manage transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={clearCart} disabled={cart.length === 0}>
              Clear Cart
            </Button>
            <Button onClick={() => setShowCustomerModal(true)}>
              {customer ? 'Change Customer' : 'Add Customer'}
            </Button>
          </div>
        </div>
        
        {/* Customer Info */}
        {customer && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">{customer.name}</p>
                <p className="text-sm text-blue-700">{customer.phone} • {customer.email}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setCustomer(null)}>
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Product Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {searchTerm && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id}>
                    {product.pricingType === 'weight-based' ? (
                      <WeightCalculator
                        pricePerKg={product.pricePerKg || 0}
                        availableWeightKg={product.totalWeightKg || 0}
                        productName={product.name}
                        onAddToCart={(weightKg, totalPrice) => addToCartByWeight(product.id, weightKg, totalPrice)}
                      />
                    ) : (
                      <div
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => addToCart(product.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <Badge variant={(product.quantity || 0) > 0 ? 'success' : 'danger'}>
                            {(product.quantity || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{product.id}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-green-600">
                            ${(product.sellingPrice || 0).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {product.quantity || 0} available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Shopping Cart</CardTitle>
                <ShoppingCart className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty</p>
                  <p className="text-sm">Search and add products above</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border-b">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.productName}</h4>
                        <div className="text-sm text-gray-500">
                          {item.pricingType === 'weight-based' ? (
                            <div>
                              <p>{item.weightKg}kg @ ${(item.unitPrice / (item.weightKg || 1)).toFixed(2)}/kg</p>
                              <Badge variant="info" className="text-xs">Weight-based</Badge>
                            </div>
                          ) : (
                            <p>${item.unitPrice.toFixed(2)} each</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.pricingType === 'weight-based' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              +
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart Summary ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Enhanced Discount Controls */}
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as 'fixed' | 'percentage')}
                      options={[
                        { value: 'fixed', label: 'Fixed ($)' },
                        { value: 'percentage', label: 'Percentage (%)' }
                      ]}
                    />
                    <Input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      placeholder={discountType === 'percentage' ? '0' : '0.00'}
                      min="0"
                      max={discountType === 'percentage' ? '100' : undefined}
                    />
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">Discount Applied:</span>
                      <span className="text-green-600 font-medium">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">After Discount:</span>
                  <span className="font-medium">${afterDiscount.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax ({(taxRate * 100).toFixed(1)}%):</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <Select
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  options={[
                    { value: 'cash', label: 'Cash' },
                    { value: 'card', label: 'Card' },
                    { value: 'mixed', label: 'Cash + Card' },
                  ]}
                />

                {paymentMethod === 'mixed' && (
                  <div className="space-y-2">
                    <Input
                      label="Cash Amount"
                      type="number"
                      step="0.01"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                    />
                    <Input
                      label="Card Amount"
                      type="number"
                      step="0.01"
                      value={cardAmount}
                      onChange={(e) => setCardAmount(parseFloat(e.target.value) || 0)}
                    />
                    {(cashAmount + cardAmount) !== total && (
                      <p className="text-xs text-red-600">
                        Amounts must equal ${total.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  {paymentMethod === 'cash' && <DollarSign className="w-4 h-4 mr-2" />}
                  {paymentMethod === 'card' && <CreditCard className="w-4 h-4 mr-2" />}
                  Complete Sale
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Customer Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false);
          setCustomerForm({name: '', phone: '', email: ''});
        }}
        title="Add Customer"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>Cancel</Button>
            <Button onClick={addCustomer}>Add Customer</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Customer Name *"
            value={customerForm.name}
            onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
            placeholder="Enter customer name"
          />
          <Input
            label="Phone Number"
            value={customerForm.phone}
            onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
            placeholder="Enter phone number"
          />
          <Input
            label="Email Address"
            type="email"
            value={customerForm.email}
            onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
            placeholder="Enter email address"
          />
        </div>
      </Modal>

      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Receipt</CardTitle>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 print:text-black" id="receipt">
                <div className="text-center border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-bold">Hardware Store</h2>
                  <p className="text-sm text-gray-600">Receipt #{lastSale.id}</p>
                  <p className="text-xs text-gray-500">{format(new Date(lastSale.date), 'MMM dd, yyyy HH:mm')}</p>
                </div>

                <div className="space-y-2">
                  {lastSale.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-gray-500">{item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                      </div>
                      <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${lastSale.subtotal.toFixed(2)}</span>
                  </div>
                  {lastSale.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-${lastSale.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-1 border-t border-gray-200">
                    <span>Total:</span>
                    <span>${lastSale.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <Badge variant="info">{lastSale.paymentMethod}</Badge>
                  </div>
                  {lastSale.paymentMethod === 'mixed' && (
                    <>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Cash:</span>
                        <span>${lastSale.cashAmount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Card:</span>
                        <span>${lastSale.cardAmount?.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
                  <p>Processed by: {lastSale.processedBy}</p>
                  <p className="mt-2">Thank you for your business!</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="secondary" onClick={() => setShowReceipt(false)} className="flex-1">
                  Close
                </Button>
                <Button onClick={printReceipt} className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
