# CarNote - Vehicle Maintenance Tracker

A comprehensive React Native mobile application for tracking vehicle maintenance, built with Expo, TypeScript, and HeroUI Native.

## 🚗 Features

- **Vehicle Management** - Track multiple vehicles with details (brand, model, year, mileage, etc.)
- **Oil Change Tracking** - Monitor oil changes with automatic interval calculations
- **Maintenance Records** - Log repairs, parts replacements, and service history
- **Technical Inspections** - Track inspection dates and expiry with urgency alerts
- **Garage Management** - Save favorite service centers with contact information
- **Dashboard** - Quick overview with stats and alerts for due services
- **Offline-First** - All data stored locally with AsyncStorage (prepared for MongoDB migration)

## 🏗️ Architecture

**Strict Layered Architecture:**
```
Presentation Layer (Screens, HeroUI Components)
         ↓
Business Logic Layer (Services, Validation)
         ↓
Data Access Layer (Repositories, AsyncStorage)
         ↓
Infrastructure Layer (Utils, Constants)
```

**Tech Stack:**
- React Native with Expo 54
- TypeScript (strict mode)
- HeroUI Native for UI components (90%+ usage)
- Expo Router for navigation
- AsyncStorage for data persistence
- Tailwind CSS via Uniwind

## 📁 Project Structure

```
src/
├── app/                    # Expo Router screens
│   └── carnote/
│       ├── (tabs)/        # Bottom tab navigation
│       │   ├── index.tsx  # Dashboard
│       │   ├── vehicles.tsx
│       │   ├── services.tsx
│       │   └── garages.tsx
│       ├── vehicles/      # Vehicle screens
│       │   └── create.tsx
│       └── garages/       # Garage screens
│           └── create.tsx
├── components/            # Reusable HeroUI components
│   └── common/
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorView.tsx
│       ├── ConfirmDialog.tsx
│       ├── Alert.tsx
│       └── StatusBadge.tsx
├── hooks/                 # Custom React hooks
│   ├── useVehicles.ts
│   ├── useOilChanges.ts
│   ├── useMaintenance.ts
│   ├── useInspections.ts
│   └── useGarages.ts
├── services/              # Business logic
│   ├── VehicleService.ts
│   ├── OilChangeService.ts
│   ├── MaintenanceService.ts
│   ├── InspectionService.ts
│   ├── GarageService.ts
│   └── SampleDataService.ts
├── repositories/          # Data access layer
│   ├── AsyncStorageRepository.ts (generic)
│   ├── VehicleRepository.ts
│   ├── OilChangeRepository.ts
│   ├── MaintenanceRepository.ts
│   ├── InspectionRepository.ts
│   └── GarageRepository.ts
├── types/                 # TypeScript interfaces
│   ├── vehicle.ts
│   ├── oilChange.ts
│   ├── maintenance.ts
│   ├── inspection.ts
│   └── garage.ts
├── utils/                 # Utility functions
│   ├── uuid.ts
│   ├── date.ts
│   └── currency.ts
└── constants/             # Theme and constants
    └── theme.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Yarn package manager
- Expo CLI
- iOS Simulator (for macOS) or Android Emulator

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn start
   # or
   npx expo start
   ```

3. Run on your device:
   ```bash
   # iOS
   npx expo run:ios

   # Android
   npx expo run:android
   ```

### First Time Setup

1. Launch the app
2. On the Dashboard, tap **"Initialize Sample Data"**
3. Refresh to see sample vehicles, services, and garages
4. Explore the app features

## 📱 Screens

### Dashboard (Home)
- Quick stats: Total vehicles, services, costs
- Alerts for oil changes due/overdue
- Alerts for inspections expiring soon
- Quick actions: Add vehicle, log service

### Vehicles
- List all vehicles with key information
- Add new vehicles with complete details
- View vehicle details (coming soon)

### Services
- Tabbed view for:
  - Oil Changes
  - Maintenance Records
  - Technical Inspections

### Garages
- List service centers
- Add favorite garages with contact info
- View garage details (coming soon)

## 🔧 Key Features

### Auto-Calculations
- **Oil Change Intervals**: Automatically calculates next service date and mileage based on vehicle settings
- **Inspection Urgency**: Color-coded urgency (good, warning, urgent, expired)
- **Cost Tracking**: Aggregates total maintenance costs

### Data Validation
- License plate uniqueness check
- Mileage progression validation (can't decrease)
- Required field validation
- Email and phone format validation
- Date range validation

### Status Indicators
- **Oil Changes**: Good (green), Due Soon (yellow), Overdue (red)
- **Inspections**: Good (green), Warning (orange), Urgent (red), Expired (dark red)
- **Maintenance**: Scheduled, In Progress, Completed, Cancelled

## 📝 Development Notes

See [FIXES_NEEDED.md](FIXES_NEEDED.md) for current TypeScript issues and fixes.

See [CLAUDE.md](CLAUDE.md) for project memory and development guidelines.

### Common Commands

```bash
# Type checking
npx tsc --noEmit

# Formatting
npx prettier --write .

# Start with cache clear
npx expo start -c
```

## 🗺️ Roadmap

### Phase 1 ✅ (Complete)
- Core data layer (types, repositories, services)
- Custom hooks for state management
- Basic UI components
- Navigation structure
- Dashboard with alerts
- Vehicle management (list, create)
- Garage management (list, create)

### Phase 2 🚧 (In Progress)
- Fix TypeScript errors
- Complete all CRUD screens
- Vehicle detail screen with tabs
- Oil change management screens
- Maintenance management screens
- Inspection management screens

### Phase 3 📋 (Planned)
- Edit functionality for all entities
- Delete with confirmation
- Search and filter
- Sorting options
- Data export (CSV/JSON)
- Statistics and charts
- Photo attachments
- Reminder notifications

### Phase 4 🔮 (Future)
- Backend API integration
- MongoDB migration
- User authentication
- Cloud sync
- Multi-user support
- Web dashboard

## 🎯 Project Goals

1. **Demonstrate HeroUI Native**: Show 90%+ usage of HeroUI components
2. **Clean Architecture**: Strict separation of concerns
3. **Type Safety**: Comprehensive TypeScript throughout
4. **Offline-First**: Full functionality without network
5. **Production-Ready**: Prepared for MongoDB backend migration

## 📚 Tech Documentation

- [Expo](https://docs.expo.dev)
- [HeroUI Native](https://github.com/heroui-inc/heroui-native)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 📄 License

This project is for demonstration and personal use.

---

Built with ❤️ using React Native, Expo, and HeroUI Native