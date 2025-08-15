# Multi-Tenant Dashboard

A comprehensive personal finance tracking application built with Vue.js 3, TypeScript, and modern web technologies. This dashboard enables users from different organizations (tenants) to manage expenses, set budgets, and visualize spending trends in a secure, isolated environment.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture**: Secure data isolation between different organizations
- **Expense Tracking**: Add, categorize, and manage personal expenses
- **Budget Management**: Set and monitor budgets by category
- **Data Visualization**: Interactive charts and graphs powered by Chart.js
- **Responsive Design**: Seamless experience across mobile and desktop devices

### Technical Highlights
- **Vue.js 3** with Composition API for modern, reactive components
- **TypeScript** for type-safe development
- **Tailwind CSS** for utility-first styling and responsive design
- **Chart.js** integration for rich data visualizations
- **Pinia** for state management
- **Vue Router** for client-side routing
- **Vite** for fast development and optimized builds

## 📊 Dashboard Features

### 1. **Dashboard Overview**
- Real-time expense summaries
- Monthly spending trends
- Category-based spending breakdown
- Recent transactions list
- Key financial metrics

### 2. **Expense Management**
- Add new expenses with description, amount, category, and date
- Filter expenses by category, date range
- Categorized expense tracking (Food, Transportation, Entertainment, etc.)
- Visual category indicators

### 3. **Budget Planning**
- Set monthly/yearly budgets by category
- Budget vs actual spending comparison
- Progress indicators and alerts
- Budget efficiency metrics

### 4. **Analytics & Insights**
- Monthly spending trend analysis
- Category distribution charts
- Weekly spending patterns
- Budget performance tracking
- Automated financial insights and recommendations

## 🏗️ Architecture

### Multi-Tenant Design
The application supports multiple tenants (organizations) with complete data isolation:
- Tenant identification based on email domain during login
- All data operations are scoped to the current tenant
- Secure authentication flow with tenant-aware routing

### Component Structure
```
src/
├── components/          # Reusable UI components
│   └── AppLayout.vue   # Main application layout
├── stores/             # Pinia stores for state management
│   ├── auth.ts         # Authentication and user management
│   └── expenses.ts     # Expense and budget data
├── views/              # Page components
│   ├── Login.vue       # Authentication page
│   ├── Dashboard.vue   # Main dashboard
│   ├── Expenses.vue    # Expense management
│   ├── Budget.vue      # Budget planning
│   └── Analytics.vue   # Data visualization and insights
└── router/             # Vue Router configuration
    └── index.ts        # Route definitions and guards
```

## 🛠️ Technology Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with vue-chartjs wrapper
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd multi-tenant-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Accounts
The application includes demo accounts for testing different tenants:

- **Company 1**: `admin@company1.com` / `password`
- **Company 2**: `user@company2.com` / `password`  
- **Demo Company**: `demo@demo.com` / `password`

Each account will show different tenant data and branding.

## 📱 Responsive Design

The application is fully responsive and provides an optimal experience across devices:

- **Desktop**: Full sidebar navigation with comprehensive data tables
- **Tablet**: Collapsible sidebar with touch-friendly interactions
- **Mobile**: Drawer navigation with optimized layouts for small screens

Key responsive features:
- Adaptive navigation (sidebar → drawer)
- Responsive grid layouts for charts and cards
- Touch-friendly form inputs and buttons
- Optimized table layouts with horizontal scrolling when needed

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler checks
```

### Project Structure

The project follows Vue.js best practices with a clear separation of concerns:

- **Components**: Reusable UI components with TypeScript props
- **Stores**: Centralized state management with Pinia
- **Views**: Page-level components with route-specific logic
- **Router**: Route configuration with authentication guards

## 🔒 Security Features

- **Authentication**: Mock JWT-based authentication system
- **Route Protection**: Authentication guards prevent unauthorized access
- **Tenant Isolation**: All data operations are tenant-scoped
- **Input Validation**: Form validation and sanitization

## 📈 Performance Optimizations

### Vite Configuration
- **Fast HMR**: Hot module replacement for instant development feedback
- **Code Splitting**: Automatic chunk splitting for vendor libraries
- **Tree Shaking**: Dead code elimination for smaller bundles
- **Asset Optimization**: Automatic image and asset optimization

### Build Optimizations
- Vendor chunk separation (Vue, Chart.js libraries)
- Lazy loading for route-based code splitting
- CSS purging with Tailwind for minimal bundle size
- TypeScript compilation for type safety and performance

## 🚀 Deployment

### CI/CD Pipeline
The project includes a GitHub Actions workflow for automated testing and deployment:

- **Continuous Integration**: Automated linting, type checking, and building
- **Staging Deployment**: Automatic deployment to staging on `develop` branch
- **Production Deployment**: Automatic deployment to production on `main` branch

### Deployment Options
The built application can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload the build files to an S3 bucket
- **GitHub Pages**: Use the included GitHub Actions workflow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the excellent framework
- Chart.js for powerful data visualization capabilities
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful icon set
