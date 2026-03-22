# 🚀 Quick Start Guide

## Installation

### 1. Install Dependencies

Run one of the following commands based on your package manager:

```bash
# Using npm
npm install

# Using pnpm
pnpm install

# Using yarn
yarn install
```

This will install all required dependencies including:
- `lucide-react` - Icon library
- `recharts` - Charts and data visualization
- `date-fns` - Date formatting and manipulation

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Default User

The system starts with a mock admin user:
- **Name**: John Doe
- **Role**: Admin
- **Email**: john.doe@hardware.com

---

## 📂 What's Included

### Pages & Routes

| Route | Module | Description |
|-------|--------|-------------|
| `/` | Dashboard | Overview with stats, recent sales, low stock alerts |
| `/inventory` | Inventory | Product catalog management, stock adjustments |
| `/pos` | Point of Sale | Sales processing, cart, receipt generation |
| `/reports` | Reports & Analytics | Sales trends, charts, performance metrics |
| `/users` | User Management | User accounts and role management (Admin only) |

### Pre-loaded Data

**10 Sample Products**:
- Hammer, Screwdriver Set, Wood Screws, Nails, Paint Brush
- Power Drill, Safety Goggles, Measuring Tape, Pliers Set, Sandpaper

**3 Sample Users**:
- John Doe (Admin)
- Jane Smith (Cashier) 
- Bob Manager (Manager)

**2 Sample Sales**:
- Recent transactions for testing

---

## 🎯 Key Features

### ✅ Inventory Management
- Add/edit/delete products
- Stock adjustments with reason tracking
- Low stock alerts (visual + banner)
- Search and filter by category
- Real-time stock indicators

### ✅ Point of Sale
- Product search and selection
- Shopping cart with quantity controls
- Multiple payment methods (Cash/Card/Mixed)
- Discount application
- Professional receipt generation
- Print functionality
- Automatic inventory deduction

### ✅ Reports & Analytics
- Date range filtering (Today/Week/Month/All)
- Revenue and profit tracking
- Interactive charts:
  - Sales trend (line chart)
  - Category breakdown (pie chart)
  - Top selling products (bar chart)
- End-of-period summary

### ✅ User Management
- Role-based access (Admin/Manager/Cashier)
- User CRUD operations
- Active/inactive status toggle
- Role permissions display

---

## 💾 Data Persistence

All data is stored in **browser localStorage**:
- Products → `localStorage.getItem('products')`
- Sales → `localStorage.getItem('sales')`
- Users → `localStorage.getItem('users')`
- Stock Adjustments → `localStorage.getItem('stockAdjustments')`

**Note**: Data is specific to each browser/device. Clearing browser data will reset to initial mock data.

---

## 🎨 Customization

### Change Colors

Edit `src/app/globals.css` to modify the color scheme:

```css
:root {
  --background: #f9fafb;
  --foreground: #111827;
}
```

### Add New Categories

Edit `src/lib/mockData.ts`:

```typescript
export const categories = ['Tools', 'Fasteners', 'YourCategory'];
```

### Modify Initial Data

Update mock data in `src/lib/mockData.ts`:
- `mockProducts` - Initial product catalog
- `mockUsers` - Default users
- `mockSales` - Sample sales

---

## 🔧 Development Tips

### Hot Reload
Next.js supports hot module replacement. Changes to components will reflect immediately without full page reload.

### TypeScript
All types are defined in `src/types/index.ts`. Extend interfaces as needed.

### Component Library
Reusable UI components are in `src/components/ui/`. Import and use throughout the app:

```tsx
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
```

---

## 📱 Testing Features

### Test Inventory Management
1. Go to `/inventory`
2. Click "Add Product" to create new items
3. Use "Adjust" to modify stock levels
4. Search and filter products

### Test Point of Sale
1. Go to `/pos`
2. Search for products
3. Add items to cart
4. Adjust quantities
5. Apply discount
6. Select payment method
7. Complete sale and view receipt

### Test Reports
1. Go to `/reports`
2. Change date range filter
3. View different chart types
4. Check top selling products

---

## 🐛 Known Issues

### TypeScript Errors Before Installation
You'll see errors for `lucide-react`, `date-fns`, and `recharts` until you run `npm install`. This is expected.

### Print Styling
Receipt printing uses browser print dialog. Results may vary by browser. Test with Chrome/Edge for best results.

### Mobile Sidebar
Current implementation shows sidebar on all screens. Consider adding a hamburger menu for mobile in production.

---

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

The optimized production build will be created in `.next/` directory.

---

## 🔐 Security Notes

**This is a frontend-only demo**. For production use:

1. **Add Backend API**: Replace localStorage with database
2. **Implement Authentication**: Add login/logout with JWT
3. **Validate User Input**: Add comprehensive form validation
4. **Secure Routes**: Implement proper role-based route protection
5. **Environment Variables**: Store sensitive data in `.env` files

---

## 📖 Full Documentation

See `FRONTEND_BLUEPRINT.md` for comprehensive documentation including:
- Architecture details
- Component API reference
- Data models
- Design system
- Future enhancement ideas

---

## ✨ Next Steps

1. **Install dependencies** → Run `npm install`
2. **Start dev server** → Run `npm run dev`
3. **Explore the app** → Visit http://localhost:3000
4. **Read blueprint** → Check `FRONTEND_BLUEPRINT.md`
5. **Customize** → Modify mock data and styling
6. **Add backend** → Connect to your API when ready

---

**Happy coding! 🎉**
