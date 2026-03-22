'use client';

import { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Calculator } from 'lucide-react';

interface WeightCalculatorProps {
  pricePerKg: number;
  availableWeightKg: number;
  productName: string;
  onAddToCart: (weightKg: number, totalPrice: number) => void;
}

export function WeightCalculator({ pricePerKg, availableWeightKg, productName, onAddToCart }: WeightCalculatorProps) {
  const [weightInput, setWeightInput] = useState('');
  const [unit, setUnit] = useState<'kg' | 'g'>('kg');

  const weightInKg = unit === 'kg' ? parseFloat(weightInput) || 0 : (parseFloat(weightInput) || 0) / 1000;
  const totalPrice = weightInKg * pricePerKg;
  const isValidWeight = weightInKg > 0 && weightInKg <= availableWeightKg;

  const quickWeights = [0.25, 0.5, 1, 2, 5];

  const handleQuickWeight = (kg: number) => {
    setWeightInput(kg.toString());
    setUnit('kg');
  };

  const handleAddToCart = () => {
    if (isValidWeight) {
      onAddToCart(weightInKg, totalPrice);
      setWeightInput('');
    }
  };

  const convertWeight = (kg: number) => {
    if (kg < 1) {
      return `${(kg * 1000).toFixed(0)}g`;
    }
    return `${kg.toFixed(2)}kg`;
  };

  return (
    <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4 text-blue-600" />
        <h4 className="font-medium text-blue-900">{productName}</h4>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-blue-700">
          <p>Price: <span className="font-semibold">${pricePerKg.toFixed(2)} per kg</span></p>
          <p>Available: <span className="font-semibold">{convertWeight(availableWeightKg)}</span></p>
        </div>

        {/* Quick Weight Buttons */}
        <div className="flex flex-wrap gap-2">
          {quickWeights.map(kg => (
            <Button
              key={kg}
              size="sm"
              variant="ghost"
              onClick={() => handleQuickWeight(kg)}
              disabled={kg > availableWeightKg}
              className="text-xs"
            >
              {convertWeight(kg)}
            </Button>
          ))}
        </div>

        {/* Custom Weight Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="Enter weight"
              min="0"
              step="0.01"
            />
          </div>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'kg' | 'g')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
          </select>
        </div>

        {/* Weight Conversion Display */}
        {weightInKg > 0 && (
          <div className="text-sm text-gray-600">
            = {unit === 'kg' ? `${(weightInKg * 1000).toFixed(0)}g` : `${weightInKg.toFixed(3)}kg`}
          </div>
        )}

        {/* Price Calculation */}
        {weightInKg > 0 && (
          <div className="p-2 bg-white rounded border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {convertWeight(weightInKg)} × ${pricePerKg.toFixed(2)}/kg
              </span>
              <span className="font-bold text-lg text-green-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Validation Messages */}
        {weightInKg > availableWeightKg && (
          <div className="text-sm text-red-600">
            Only {convertWeight(availableWeightKg)} available
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!isValidWeight}
          className="w-full"
        >
          Add {weightInKg > 0 ? convertWeight(weightInKg) : ''} to Cart
          {totalPrice > 0 && ` - $${totalPrice.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
