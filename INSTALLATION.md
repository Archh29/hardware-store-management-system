# 📦 Installation Instructions

## Step-by-Step Setup

### 1️⃣ Install Dependencies

The TypeScript errors you're seeing are expected - they'll resolve once you install the required packages.

**Run this command in your terminal:**

```bash
npm install
```

This will install:
- ✅ `lucide-react@^0.263.1` - Icon library (540+ icons)
- ✅ `recharts@^2.12.0` - Chart components for analytics
- ✅ `date-fns@^3.3.1` - Date formatting utilities
- ✅ All existing dependencies (Next.js, React, TailwindCSS)

### 2️⃣ Start Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**

### 3️⃣ Explore the Application

Navigate through all modules:

| URL | Module | Description |
|-----|--------|-------------|
| http://localhost:3000 | Dashboard | Overview & statistics |
| http://localhost:3000/inventory | Inventory | Product management |
| http://localhost:3000/pos | POS | Sales processing |
| http://localhost:3000/reports | Reports | Analytics & charts |
| http://localhost:3000/users | Users | User management |

---

## 🎯 What to Try First

### Test Drive the System

1. **Dashboard** - View the overview with sample data
2. **Inventory** - Add a new product
3. **POS** - Make a test sale
4. **Reports** - View sales charts
5. **Users** - Explore user management

### Sample Data Included

- 10 products (tools, fasteners, etc.)
- 3 users (Admin, Manager, Cashier)
- 2 sample sales
- Pre-configured categories & suppliers

---

## 🔧 Troubleshooting

### TypeScript Errors Before Installation
**Problem**: Red underlines in VS Code for `lucide-react`, `date-fns`, `recharts`

**Solution**: These will disappear after running `npm install`

### Port Already in Use
**Problem**: "Port 3000 is already in use"

**Solution**: 
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### TailwindCSS @theme Warning
**Problem**: "Unknown at rule @theme" warning in globals.css

**Solution**: This is a TailwindCSS v4 feature - the warning is cosmetic and can be ignored. The CSS works correctly.

### Module Not Found Errors
**Problem**: Cannot find module errors

**Solution**: Make sure you're in the correct directory:
```bash
cd C:/Users/uygua/j7hardwareinvsystem
npm install
```

---

## 🚀 Build for Production

### Create Optimized Build

```bash
npm run build
```

This will:
- Type-check all files
- Optimize and bundle code
- Generate static pages where possible
- Create production build in `.next/`

### Start Production Server

```bash
npm start
```

Production app runs at **http://localhost:3000**

---

## 📱 Browser Compatibility

**Recommended Browsers:**
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

**Print Receipts:**
- Best results in Chrome/Edge
- Print dialog → Choose printer or "Save as PDF"

---

## 💾 Data Storage

All data is stored in **browser localStorage**:
- Each browser/device has separate data
- Clearing browser data resets to sample data
- Not shared across browsers or devices

**Location in Browser:**
- Open DevTools (F12)
- Application tab → Local Storage → http://localhost:3000
- View: `products`, `sales`, `users`, `stockAdjustments`, `currentUser`

---

## 🎨 Customization Tips

### Change Mock Data

Edit `src/lib/mockData.ts`:
- Add more products
- Modify categories
- Change suppliers
- Add sample sales

### Modify Colors

Edit `src/app/globals.css`:
```css
:root {
  --background: #f9fafb;  /* Change background color */
  --foreground: #111827;  /* Change text color */
}
```

### Add New Features

1. Create new components in `src/components/`
2. Add new pages in `src/app/[your-page]/page.tsx`
3. Update types in `src/types/index.ts`
4. Add to Sidebar in `src/components/Sidebar.tsx`

---

## 📚 Next Steps

After installation:

1. ✅ Read **QUICKSTART.md** for feature walkthroughs
2. ✅ Review **FRONTEND_BLUEPRINT.md** for technical details
3. ✅ Explore the codebase and components
4. ✅ Customize for your needs
5. ✅ Plan backend integration (optional)

---

## 🆘 Need Help?

### Documentation Files
- `README.md` - Project overview
- `QUICKSTART.md` - Getting started guide
- `FRONTEND_BLUEPRINT.md` - Complete technical documentation
- `INSTALLATION.md` - This file

### Common Issues

**Q: How do I reset the data?**
A: Clear localStorage in browser DevTools or delete specific keys.

**Q: Can I use this in production?**
A: This is a frontend demo. Add backend API, authentication, and database for production.

**Q: How do I add more users/products?**
A: Use the UI (Inventory/Users pages) or edit `src/lib/mockData.ts`.

**Q: Where are the images stored?**
A: Currently using Lucide icon placeholders. Implement image upload for production.

---

**Ready to start! Run `npm install` and `npm run dev` 🚀**
