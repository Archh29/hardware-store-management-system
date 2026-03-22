# Hardware Store Management System - Frontend Blueprint

## 🎨 Design Overview

A modern, responsive hardware store management system built with **Next.js 16**, **React 19**, **TailwindCSS v4**, and **TypeScript**. Features a clean, professional UI with intuitive navigation and comprehensive functionality for inventory management, point-of-sale operations, reporting, and user management.

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16.2.1 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: TailwindCSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Language**: TypeScript 5
- **State Management**: React Context API + localStorage

### Project Structure
```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard (/)
│   ├── inventory/           # Inventory Management (/inventory)
│   ├── pos/                 # Point of Sale (/pos)
│   ├── reports/             # Reports & Analytics (/reports)
│   ├── users/               # User Management (/users)
│   ├── layout.tsx           # Root layout with sidebar
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── ui/                  # UI component library
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   ├── Sidebar.tsx          # Navigation sidebar
│   └── StatCard.tsx         # Statistics card component
├── context/                 # State management
│   └── StoreContext.tsx     # Global store context
├── lib/                     # Utilities and data
│   └── mockData.ts          # Mock data for development
└── types/                   # TypeScript definitions
    └── index.ts             # Type definitions
```

---

## 📦 Core Modules

### 1. **Dashboard** (`/`)
The main landing page providing an overview of the entire system.

#### Features
- **Statistics Cards**: Display key metrics
  - Total Products
  - Today's Revenue (with sales count)
  - Total Sales
  - Low Stock Items
- **Recent Sales**: List of the 5 most recent transactions
- **Low Stock Alerts**: Products below reorder level
- **Inventory Overview**: 
  - Total inventory value
  - Total revenue
  - Items in stock count

#### Key Components
- `StatCard` - Displays metric with icon and optional trend
- `Card` components for sections
- `Badge` for payment methods and stock status

#### Data Visualization
- Color-coded metric cards (blue, green, purple, red)
- Real-time calculations from sales and inventory data
- Date formatting with `date-fns`

---

### 2. **Inventory Management** (`/inventory`)
Comprehensive product catalog and stock management.

#### Features
##### Product Management
- **Add Product**: Modal form with fields:
  - Product Name *
  - Category (dropdown) *
  - Supplier (dropdown)
  - Brand
  - Cost Price *
  - Selling Price *
  - Initial Quantity *
  - Reorder Level

- **Edit Product**: Update existing product details
- **Delete Product**: Remove product from catalog
- **Stock Adjustment**: 
  - Manual inventory corrections
  - Damage/loss recording
  - Reason tracking

##### Display & Filtering
- **Search**: Real-time search by product name or ID
- **Category Filter**: Filter by product category
- **Product Table**: Comprehensive data grid showing:
  - Product image placeholder
  - Name and ID
  - Category badge
  - Supplier
  - Cost price
  - Selling price
  - Stock quantity with visual indicator
  - Status (Low Stock / In Stock)
  - Action buttons

##### Visual Indicators
- Stock level progress bar (green = healthy, red = low)
- Low stock alert banner at top
- Badge system for categories and status

#### Key Components
- `Modal` for add/edit/adjust forms
- `Input` for text and number fields
- `Select` for dropdowns
- `Badge` for status and categories
- Table with hover effects

#### Business Logic
- Auto-generated product IDs (P001, P002, etc.)
- Real-time low stock detection
- Stock valuation calculations
- Automatic timestamp updates

---

### 3. **Point of Sale (POS)** (`/pos`)
Streamlined sales processing interface.

#### Features
##### Product Selection
- **Search Bar**: Instant product lookup
- **Product List**: Searchable product catalog with:
  - Product name and ID
  - Category
  - Price
  - Stock availability badge

##### Shopping Cart
- **Add/Remove Items**: Click to add, button to remove
- **Quantity Controls**: 
  - Increment/decrement buttons
  - Direct input field
  - Stock limit validation
- **Item Display**:
  - Product name
  - Unit price
  - Quantity controls
  - Subtotal
  - Remove button

##### Payment Processing
- **Price Calculation**:
  - Subtotal display
  - Discount input (dollar amount)
  - Total with discount applied
- **Payment Methods**:
  - Cash
  - Card
  - Mixed (Cash + Card)
- **Mixed Payment Split**: Separate inputs for cash and card amounts

##### Receipt Generation
- **Receipt Modal**: Professional receipt display
  - Store header
  - Receipt ID and timestamp
  - Itemized list with quantities and prices
  - Subtotal, discount, total
  - Payment method details
  - Processed by user name
  - Thank you message
- **Print Functionality**: Browser print support

#### Key Components
- Product search with live filtering
- Shopping cart with CRUD operations
- Payment form with validation
- Receipt modal with print CSS

#### Business Logic
- Stock availability checks
- Automatic inventory deduction on sale
- Payment amount validation for mixed payments
- Auto-generated sale IDs
- Real-time cart total calculation

---

### 4. **Reports & Analytics** (`/reports`)
Comprehensive business intelligence dashboard.

#### Features
##### Date Range Filtering
- Today
- This Week
- This Month
- All Time

##### Metrics Overview
- **Total Revenue**: Sales sum for period
- **Total Profit**: Margin calculations
- **Items Sold**: Total units
- **Inventory Value**: Current stock valuation

##### Data Visualizations
###### Sales Trend (Line Chart)
- Daily revenue over time
- X-axis: Date
- Y-axis: Revenue ($)
- Interactive tooltips

###### Sales by Category (Pie Chart)
- Revenue breakdown by product category
- Color-coded segments
- Value labels
- Interactive tooltips

###### Top Selling Products (Horizontal Bar Chart)
- Top 10 products by quantity sold
- Product names on Y-axis
- Quantity on X-axis
- Sorted by sales volume

###### Product Performance List
- Ranked list of top products
- Shows units sold and revenue
- Numbered ranking badges

##### End of Period Summary
- **Cash Collected**: Total cash payments
- **Card Payments**: Total card transactions
- **Average Sale**: Revenue per transaction
- **Products in Stock**: Current inventory count

#### Key Components
- `Select` for date range filtering
- Recharts components (LineChart, PieChart, BarChart)
- Stat cards with icons
- Color-coded summary boxes

#### Business Logic
- Dynamic date range filtering with `date-fns`
- Profit margin calculations
- Revenue aggregation by category
- Top products ranking algorithm
- Average sale calculations

---

### 5. **User Management** (`/users`)
User account and role management (Admin only).

#### Features
##### User Operations
- **Add User**: Create new user accounts
  - Full name
  - Email address
  - Role assignment
- **Edit User**: Update user details
- **Delete User**: Remove user accounts
- **Toggle Status**: Activate/deactivate users

##### User Display
- **Statistics Cards**:
  - Total Users
  - Active Users
  - Administrators count
- **User Table**:
  - Avatar with initials
  - Name and ID
  - Email address
  - Role badge
  - Status badge
  - Action buttons

##### Role System
Three distinct roles with defined permissions:

###### Admin
- Full system access
- User management
- All CRUD operations
- Reports and analytics
- Badge color: Red

###### Manager
- View reports
- Inventory adjustments
- Limited editing
- No user management
- Badge color: Yellow

###### Cashier
- POS access only
- View products
- Record sales
- No backend access
- Badge color: Blue

##### Role Permissions Display
Information cards explaining each role's capabilities

#### Key Components
- User table with avatar generation
- Role-based badge styling
- Modal forms for add/edit
- Permission cards
- Access control checks

#### Business Logic
- Auto-generated user IDs (U001, U002, etc.)
- Avatar generation from initials
- Role-based UI rendering
- Current user permission checks
- Confirmation dialogs for destructive actions

---

## 🎨 UI Component Library

### Button
**Props**: `variant`, `size`, `className`, `children`

**Variants**:
- `primary` - Blue background (default)
- `secondary` - Gray background
- `danger` - Red background
- `ghost` - Transparent with hover

**Sizes**: `sm`, `md`, `lg`

### Card
Modular card system with sub-components:
- `Card` - Container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardContent` - Main content area

### Input
**Props**: `label`, `error`, `type`, `className`
- Full-width text input
- Optional label and error message
- Focus ring styling
- Support for all HTML input types

### Select
**Props**: `label`, `error`, `options`, `className`
- Dropdown with label
- Options array: `{ value, label }`
- Error state styling

### Badge
**Props**: `variant`, `className`, `children`

**Variants**:
- `success` - Green (stock available, active status)
- `warning` - Yellow (manager role)
- `danger` - Red (low stock, admin role)
- `info` - Blue (payment methods, cashier role)
- `default` - Gray (neutral states)

### Modal
**Props**: `isOpen`, `onClose`, `title`, `children`, `footer`
- Centered overlay
- Backdrop click to close
- Header with close button
- Scrollable content
- Optional footer for actions

### StatCard
**Props**: `title`, `value`, `icon`, `trend`, `iconColor`
- Metric display card
- Icon with colored background
- Optional trend indicator
- Flexible icon color

### Sidebar
Fixed navigation sidebar with:
- Store branding
- Navigation links with icons
- Active route highlighting
- User profile section at bottom

---

## 💾 State Management

### StoreContext
Centralized state using React Context API with localStorage persistence.

#### State Variables
- `products` - Product catalog
- `sales` - Sales history
- `users` - User accounts
- `stockAdjustments` - Inventory adjustments
- `currentUser` - Active user session

#### Methods
##### Product Operations
- `addProduct(product)` - Add new product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Remove product

##### Sales Operations
- `addSale(sale)` - Record sale and update inventory

##### Stock Operations
- `addStockAdjustment(adjustment)` - Log adjustment
- `updateStock(productId, change)` - Modify quantity

##### User Operations
- `addUser(user)` - Create user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Remove user
- `setCurrentUser(user)` - Change active user

#### Persistence
All data automatically synced to localStorage on change, loaded on mount.

---

## 📊 Data Models

### Product
```typescript
{
  id: string;              // P001, P002, etc.
  name: string;
  category: string;
  supplier: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  reorderLevel: number;
  brand?: string;
  lastUpdated: string;     // ISO timestamp
}
```

### Sale
```typescript
{
  id: string;              // S[random]
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mixed';
  cashAmount?: number;
  cardAmount?: number;
  date: string;            // ISO timestamp
  processedBy: string;     // User name
}
```

### SaleItem
```typescript
{
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
```

### User
```typescript
{
  id: string;              // U001, U002, etc.
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager';
  active: boolean;
}
```

### StockAdjustment
```typescript
{
  id: string;              // A[random]
  productId: string;
  productName: string;
  quantityChange: number;  // Positive or negative
  reason: string;
  adjustedBy: string;      // User name
  date: string;            // ISO timestamp
}
```

---

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3b82f6` - Primary actions, links
- **Success Green**: `#10b981` - Positive states, in stock
- **Warning Yellow**: `#f59e0b` - Caution states
- **Danger Red**: `#ef4444` - Alerts, low stock, delete
- **Purple**: `#8b5cf6` - Secondary metrics
- **Orange**: `#f97316` - Inventory value

### Typography
- **Font Family**: System font stack (Geist Sans, Geist Mono as variables)
- **Headings**: Bold, various sizes (text-3xl, text-2xl, text-xl, text-lg)
- **Body**: Regular weight, text-sm and text-base
- **Labels**: Medium weight, text-xs uppercase for table headers

### Spacing
Consistent spacing scale using Tailwind utilities:
- **Component padding**: `p-4`, `p-6`, `p-8`
- **Gaps**: `gap-4`, `gap-6`
- **Margins**: `mb-4`, `mb-6`, `mb-8`

### Shadows & Borders
- **Cards**: `shadow-sm` with `border border-gray-200`
- **Modals**: `shadow-xl`
- **Buttons**: Focus ring with `ring-2 ring-offset-2`

### Responsive Design
- **Mobile**: Single column layouts
- **Tablet**: 2-column grids (`md:grid-cols-2`)
- **Desktop**: 3-4 column grids (`lg:grid-cols-3`, `lg:grid-cols-4`)
- **Sidebar**: Hidden on mobile (expandable in future)

---

## 🚀 Getting Started

### Installation
```bash
# Install dependencies (use your preferred package manager)
npm install
# or
pnpm install
# or
yarn install
```

### Required Dependencies
The following packages need to be installed:
- `lucide-react` - Icon library
- `recharts` - Charting library
- `date-fns` - Date utilities

### Development
```bash
npm run dev
```
Visit `http://localhost:3000` to view the application.

### Build
```bash
npm run build
npm start
```

---

## 📱 Features Checklist

### ✅ Inventory Management
- [x] Add/Edit/Delete products
- [x] Product fields (ID, name, category, supplier, prices, quantity, reorder level)
- [x] Stock adjustment functionality
- [x] Low stock alerts
- [x] Category and supplier filtering
- [x] Search functionality
- [x] Stock valuation display

### ✅ Point of Sale (POS)
- [x] Product selection and search
- [x] Shopping cart with quantity controls
- [x] Automatic inventory deduction
- [x] Payment method selection (cash/card/mixed)
- [x] Discount application
- [x] Receipt generation
- [x] Print functionality
- [x] Stock availability checks

### ✅ Reports & Analytics
- [x] Date range filtering (today/week/month/all)
- [x] Revenue and profit calculations
- [x] Sales trend visualization (line chart)
- [x] Category breakdown (pie chart)
- [x] Top selling products (bar chart)
- [x] Product performance list
- [x] End-of-period summary
- [x] Cash vs card payment breakdown

### ✅ User Management
- [x] Add/Edit/Delete users
- [x] Role assignment (admin/manager/cashier)
- [x] User status toggle (active/inactive)
- [x] Role permissions display
- [x] Access control based on role
- [x] User statistics

### ✅ Dashboard
- [x] Statistics overview cards
- [x] Recent sales list
- [x] Low stock alerts
- [x] Inventory value summary
- [x] Revenue tracking

---

## 🔐 Access Control

### Role-Based Features

#### Admin Access
- ✅ Full dashboard access
- ✅ Complete inventory management
- ✅ POS operations
- ✅ All reports and analytics
- ✅ User management (add/edit/delete)

#### Manager Access
- ✅ Dashboard view
- ✅ Inventory view and adjustments
- ✅ All reports and analytics
- ❌ No user management
- ❌ Limited delete permissions

#### Cashier Access
- ✅ POS operations only
- ✅ View product information
- ❌ No inventory management
- ❌ No reports access
- ❌ No user management

*Note: Current implementation shows all modules in sidebar. Add role checks to hide/disable routes based on user role in production.*

---

## 📝 Mock Data

### Initial Products (10 items)
- Hammer - Claw Type
- Screwdriver Set (6pc)
- Wood Screws 2" (100pc)
- Nails 3" (500g)
- Paint Brush 2"
- Power Drill - Cordless
- Safety Goggles
- Measuring Tape 25ft
- Pliers Set (3pc)
- Sandpaper Assorted (10pc)

### Categories
- Tools
- Fasteners
- Painting
- Power Tools
- Safety
- Abrasives

### Sample Users
- John Doe (Admin)
- Jane Smith (Cashier)
- Bob Manager (Manager)

---

## 🎯 Future Enhancements

### Recommended Features
1. **Authentication**: Add login system with JWT/sessions
2. **Backend Integration**: Connect to REST API or GraphQL
3. **Database**: Replace localStorage with PostgreSQL/MongoDB
4. **Multi-location**: Support for multiple store locations
5. **Barcode Scanning**: Integrate barcode reader for POS
6. **Email Receipts**: Send receipts via email
7. **Supplier Management**: Dedicated supplier module
8. **Purchase Orders**: Track orders to suppliers
9. **Customer Management**: Loyalty program, customer database
10. **Mobile App**: React Native or PWA version
11. **Advanced Analytics**: More detailed reports, forecasting
12. **Export Features**: PDF/Excel report exports
13. **Notifications**: Email/SMS alerts for low stock
14. **Audit Logs**: Track all user actions
15. **Multi-currency**: Support multiple currencies

---

## 💡 UI/UX Best Practices Implemented

1. **Consistent Navigation**: Fixed sidebar with clear active states
2. **Visual Hierarchy**: Clear headings, card groupings, proper spacing
3. **Feedback**: Loading states, success messages, error handling
4. **Accessibility**: Semantic HTML, keyboard navigation support
5. **Responsive Design**: Mobile-first approach with breakpoints
6. **Color Coding**: Intuitive use of colors for status (green=good, red=alert)
7. **Search & Filter**: Easy data discovery in large datasets
8. **Modal Workflows**: Non-disruptive add/edit operations
9. **Confirmation Dialogs**: Prevent accidental deletions
10. **Print Optimization**: Proper print styles for receipts

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. **No Backend**: All data stored in localStorage (client-side only)
2. **No Authentication**: No login system, uses mock current user
3. **Single Session**: Data not shared across devices/browsers
4. **No Image Upload**: Product images use placeholder icons
5. **Basic Validation**: Limited form validation
6. **No Barcode Support**: Manual product selection only
7. **Print Styling**: Receipt print may need browser-specific adjustments

### TypeScript/Lint Notes
- `lucide-react`, `date-fns`, `recharts` packages need to be installed
- The `@theme` CSS rule is TailwindCSS v4 specific (safe to ignore warning)

---

## 📄 License & Credits

This is a demonstration frontend application showcasing modern React/Next.js development practices. Modify and extend as needed for production use.

### Technologies Used
- Next.js 16 - React Framework
- TailwindCSS v4 - Utility-first CSS
- Lucide React - Icon library
- Recharts - Chart library
- date-fns - Date utilities
- TypeScript - Type safety

---

**Built with ❤️ for modern hardware store management**
