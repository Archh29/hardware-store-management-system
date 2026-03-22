# 🛠️ Hardware Store Management System

A modern, fully-featured hardware store management system built with **Next.js 16**, **React 19**, **TailwindCSS v4**, and **TypeScript**. This comprehensive frontend application provides inventory management, point-of-sale operations, analytics, and user management capabilities.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Modules](#-modules)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✨ Features

### 📦 Inventory Management
- ✅ Add, edit, and delete products
- ✅ Track stock levels with visual indicators
- ✅ Low stock alerts and notifications
- ✅ Stock adjustment with reason tracking
- ✅ Product search and category filtering
- ✅ Supplier and brand management
- ✅ Real-time inventory valuation

### 💰 Point of Sale (POS)
- ✅ Fast product search and selection
- ✅ Shopping cart with quantity controls
- ✅ Multiple payment methods (Cash/Card/Mixed)
- ✅ Discount application
- ✅ Professional receipt generation
- ✅ Print functionality
- ✅ Automatic inventory deduction
- ✅ Stock availability validation

### 📊 Reports & Analytics
- ✅ Interactive sales trend charts (Line, Pie, Bar)
- ✅ Revenue and profit tracking
- ✅ Top selling products analysis
- ✅ Category performance breakdown
- ✅ Date range filtering (Today/Week/Month/All)
- ✅ End-of-period summaries
- ✅ Payment method analytics

### 👥 User Management
- ✅ Role-based access control (Admin/Manager/Cashier)
- ✅ User CRUD operations
- ✅ Active/inactive status management
- ✅ Permission-based UI rendering
- ✅ User activity tracking

### 🎯 Dashboard
- ✅ Real-time statistics overview
- ✅ Recent sales display
- ✅ Low stock alerts
- ✅ Inventory value summary
- ✅ Quick insights and metrics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript 5** | Type safety |
| **TailwindCSS v4** | Utility-first CSS |
| **Lucide React** | Icon library |
| **Recharts** | Data visualization |
| **date-fns** | Date formatting |
| **Context API** | State management |
| **localStorage** | Data persistence |

---

## 📂 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Dashboard
│   ├── inventory/page.tsx       # Inventory Management
│   ├── pos/page.tsx             # Point of Sale
│   ├── reports/page.tsx         # Reports & Analytics
│   ├── users/page.tsx           # User Management
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   ├── Sidebar.tsx              # Navigation sidebar
│   └── StatCard.tsx             # Statistics card
│
├── context/                      # State management
│   └── StoreContext.tsx         # Global store context
│
├── lib/                         # Utilities
│   └── mockData.ts              # Mock data
│
└── types/                       # TypeScript definitions
    └── index.ts                 # Type definitions
```

---

## 📱 Modules

### 1. Dashboard (`/`)
Central hub displaying key metrics, recent sales, low stock alerts, and inventory overview.

### 2. Inventory Management (`/inventory`)
Complete product catalog management with CRUD operations, stock adjustments, and filtering capabilities.

### 3. Point of Sale (`/pos`)
Streamlined sales processing with cart management, payment handling, and receipt generation.

### 4. Reports & Analytics (`/reports`)
Comprehensive business intelligence with interactive charts and performance metrics.

### 5. User Management (`/users`)
User account administration with role-based access control (Admin only).

---

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Step-by-step setup guide
- **[FRONTEND_BLUEPRINT.md](./FRONTEND_BLUEPRINT.md)** - Comprehensive technical documentation
  - Architecture overview
  - Component API reference
  - Data models
  - Design system
  - Feature checklist
  - Future enhancements

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Actions, links
- **Success**: Green (#10b981) - Positive states
- **Warning**: Yellow (#f59e0b) - Caution states
- **Danger**: Red (#ef4444) - Alerts, errors
- **Purple**: Purple (#8b5cf6) - Secondary metrics
- **Orange**: Orange (#f97316) - Inventory highlights

### Components
Custom UI component library built with TailwindCSS:
- Buttons (4 variants, 3 sizes)
- Cards (modular sections)
- Inputs (with labels and validation)
- Selects (dropdown menus)
- Badges (5 color variants)
- Modals (overlay dialogs)

---

## 💾 Data Persistence

All data is stored in browser **localStorage**:
- Products catalog
- Sales history
- User accounts
- Stock adjustments

**Note:** This is a frontend-only demo. For production, replace localStorage with a backend API and database.

---

## 🔐 User Roles

### Admin
- Full system access
- Manage users
- All CRUD operations

### Manager  
- View reports
- Adjust inventory
- Limited editing

### Cashier
- POS access only
- Record sales
- View products

---

## 📦 Mock Data Included

- **10 Sample Products** (Tools, Fasteners, Power Tools, etc.)
- **3 Sample Users** (Admin, Manager, Cashier)
- **2 Sample Sales** for testing
- **Categories & Suppliers** pre-configured

---

## 🐛 Known Limitations

1. **Client-side only** - No backend/database
2. **localStorage** - Data not shared across devices
3. **No authentication** - Mock user system
4. **Basic validation** - Minimal form validation
5. **No image uploads** - Placeholder icons only

---

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication (JWT/OAuth)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Barcode scanning support
- [ ] Email receipts
- [ ] Multi-location support
- [ ] Advanced analytics
- [ ] Export to PDF/Excel
- [ ] Mobile app (PWA)
- [ ] Real-time notifications

---

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Fork and modify
- Report issues
- Suggest enhancements
- Use as a learning resource

---

## 📄 License

This project is provided as-is for educational and demonstration purposes.

---

## 🙏 Acknowledgments

Built with modern web technologies:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)

---

**Made with ❤️ for hardware store management**

For detailed technical documentation, see [FRONTEND_BLUEPRINT.md](./FRONTEND_BLUEPRINT.md)
