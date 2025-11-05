# CarNote Application - Technical Specification for Claude Code

## Executive Summary

**CarNote** is a React Native mobile application built with Expo and HeroUI Native designed to manage vehicle maintenance records, fuel expenses, technical inspections, and garage information. The application leverages a **local-first architecture** using AsyncStorage for JSON-based data persistence, with a clear migration path to MongoDB. The specification prioritizes HeroUI Native component utilization following the prescribed stack architecture, modern responsive design, and comprehensive data management capabilities.

---

## Project Overview

### Application Purpose
CarNote enables vehicle owners to:
- Track maintenance records for single or multiple vehicles
- Record oil changes with detailed specifications
- Log maintenance activities and repairs
- Track technical inspections and their schedules
- Manage garage and inspection center information
- Generate maintenance history and cost analytics

### Technology Stack
- **Framework:** React Native with Expo (latest stable version)
- **UI Library:** HeroUI Native (utilize maximum components and theming)
- **State Management:** Local state with AsyncStorage (prepare for Redux/Zustand migration)
- **Data Persistence:** AsyncStorage with JSON serialization (migration-ready for MongoDB)
- **Navigation:** Expo Router (native stack-based navigation)
- **Styling:** Tailwind CSS via Uniwind configuration in HeroUI Native

### Development Approach
This specification follows **spec-driven development principles**. The agent (Claude Code) should:
1. **Understand the complete system architecture** before writing code
2. **Prioritize HeroUI Native components** - maximize native component usage
3. **Follow the layered architecture pattern** (Presentation → Business Logic → Data Access)
4. **Create modular, reusable components** aligned with HeroUI Native best practices
5. **Implement JSON schema** that mirrors MongoDB structure for future migration
6. **Build with offline-first mentality** using AsyncStorage

---

## Application Architecture

### Layered Architecture Structure

```
┌─────────────────────────────────────────────────────┐
│          PRESENTATION LAYER                         │
│  (Screens, HeroUI Components, UI Logic)             │
├─────────────────────────────────────────────────────┤
│          BUSINESS LOGIC LAYER                       │
│  (Validation, Calculations, Business Rules)         │
├─────────────────────────────────────────────────────┤
│          DATA ACCESS LAYER                          │
│  (AsyncStorage Repository, Data Transformations)    │
├─────────────────────────────────────────────────────┤
│          INFRASTRUCTURE LAYER                       │
│  (Logging, Utilities, Device APIs)                  │
└─────────────────────────────────────────────────────┘
```

### Project Directory Structure

```
src/
├── app/                              # Main application entry and navigation
│   ├── _layout.tsx                   # Root layout with navigation setup
│   ├── index.tsx                     # Home screen
│   ├── vehicles/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                 # Vehicle list screen
│   │   ├── [vehicleId].tsx           # Vehicle detail screen
│   │   └── create.tsx                # Create vehicle screen
│   ├── oil-changes/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                 # Oil changes list
│   │   ├── [oilChangeId].tsx         # Oil change detail
│   │   └── create.tsx                # Create oil change
│   ├── maintenance/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                 # Maintenance list
│   │   ├── [maintenanceId].tsx       # Maintenance detail
│   │   └── create.tsx                # Create maintenance
│   ├── inspections/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                 # Technical inspection list
│   │   ├── [inspectionId].tsx        # Inspection detail
│   │   └── create.tsx                # Create inspection
│   ├── garages/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                 # Garage/center list
│   │   ├── [garageId].tsx            # Garage detail
│   │   └── create.tsx                # Create garage
│   └── settings/
│       ├── index.tsx                 # Settings screen
│       └── about.tsx                 # About screen
│
├── components/                       # Reusable UI components
│   ├── shared/                       # Shared across app
│   │   ├── Header.tsx
│   │   ├── FloatingActionButton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── ErrorBoundary.tsx
│   ├── vehicles/
│   │   ├── VehicleCard.tsx
│   │   ├── VehicleForm.tsx
│   │   └── VehicleStats.tsx
│   ├── oil-changes/
│   │   ├── OilChangeCard.tsx
│   │   ├── OilChangeForm.tsx
│   │   └── OilChangeTimeline.tsx
│   ├── maintenance/
│   │   ├── MaintenanceCard.tsx
│   │   ├── MaintenanceForm.tsx
│   │   └── MaintenanceTimeline.tsx
│   ├── inspections/
│   │   ├── InspectionCard.tsx
│   │   ├── InspectionForm.tsx
│   │   └── InspectionStatus.tsx
│   └── garages/
│       ├── GarageCard.tsx
│       ├── GarageForm.tsx
│       └── GarageSelector.tsx
│
├── services/                         # Business logic layer
│   ├── vehicleService.ts             # Vehicle CRUD operations
│   ├── oilChangeService.ts           # Oil change operations
│   ├── maintenanceService.ts         # Maintenance operations
│   ├── inspectionService.ts          # Inspection operations
│   ├── garageService.ts              # Garage operations
│   ├── validationService.ts          # Data validation
│   └── calculationService.ts         # Calculations (costs, intervals)
│
├── repositories/                     # Data access layer
│   ├── AsyncStorageRepository.ts     # AsyncStorage abstraction
│   ├── vehicleRepository.ts
│   ├── oilChangeRepository.ts
│   ├── maintenanceRepository.ts
│   ├── inspectionRepository.ts
│   └── garageRepository.ts
│
├── hooks/                            # Custom React hooks
│   ├── useAsyncStorage.ts            # Generic storage hook
│   ├── useVehicles.ts
│   ├── useOilChanges.ts
│   ├── useMaintenance.ts
│   ├── useInspections.ts
│   ├── useGarages.ts
│   └── useNavigation.ts
│
├── types/                            # TypeScript interfaces
│   ├── vehicle.ts
│   ├── oilChange.ts
│   ├── maintenance.ts
│   ├── inspection.ts
│   ├── garage.ts
│   └── common.ts
│
├── constants/                        # Application constants
│   ├── theme.ts                      # HeroUI theme customization
│   ├── storage.ts                    # AsyncStorage keys
│   └── validation.ts                 # Validation rules
│
├── utils/                            # Utility functions
│   ├── dateUtils.ts                  # Date formatting, calculations
│   ├── currencyUtils.ts              # Currency formatting
│   ├── stringUtils.ts                # String manipulation
│   └── errorHandler.ts               # Error handling
│
└── context/                          # React context (if needed)
    └── AppContext.ts                 # Global app state if necessary
```

---

## Data Models & Schema

### Core Entities with MongoDB-Compatible Structure

#### Vehicle Entity
```json
{
  "_id": "unique_id",
  "name": "Toyota Corolla",
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "licensePlate": "ABC-1234",
  "currentMileage": 45000,
  "registrationDate": "2020-03-15T00:00:00Z",
  "fuelType": "Petrol",
  "engineType": "1.8L",
  "oilType": "5W-30",
  "oilChangeInterval": 10000,
  "color": "Silver",
  "notes": "Regular maintenance vehicle",
  "imageUrl": null,
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

#### Oil Change Entity
```json
{
  "_id": "unique_id",
  "vehicleId": "vehicle_ref_id",
  "centerGarageId": "garage_ref_id",
  "date": "2024-01-15T10:00:00Z",
  "mileage": 45000,
  "oilType": "5W-30",
  "cost": 45.50,
  "currency": "EUR",
  "nextOilChangeDate": "2024-04-15T10:00:00Z",
  "nextOilChangeMileage": 55000,
  "notes": "Regular service completed",
  "centerName": "AutoCare Center",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### Maintenance Entity
```json
{
  "_id": "unique_id",
  "vehicleId": "vehicle_ref_id",
  "centerGarageId": "garage_ref_id",
  "type": "Tire Rotation",
  "date": "2024-01-10T10:00:00Z",
  "mileage": 44500,
  "cost": 60.00,
  "currency": "EUR",
  "description": "Seasonal tire rotation and balance",
  "partsReplaced": ["Front Left Tire", "Front Right Tire"],
  "technician": "John Smith",
  "status": "Completed",
  "notes": "All tires in good condition",
  "createdAt": "2024-01-10T10:00:00Z",
  "updatedAt": "2024-01-10T10:00:00Z"
}
```

#### Technical Inspection Entity
```json
{
  "_id": "unique_id",
  "vehicleId": "vehicle_ref_id",
  "inspectionCenterId": "garage_ref_id",
  "datePerformed": "2024-01-20T10:00:00Z",
  "dateExpired": "2025-01-20T10:00:00Z",
  "mileage": 45200,
  "status": "Passed",
  "result": "Vehicle passed all inspection requirements",
  "certificateNumber": "TC-2024-001",
  "cost": 120.00,
  "currency": "EUR",
  "notes": "All safety checks passed",
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:00:00Z"
}
```

#### Garage/Inspection Center Entity
```json
{
  "_id": "unique_id",
  "name": "AutoCare Center",
  "type": "Garage",
  "phoneNumber": "+33123456789",
  "email": "info@autocare.com",
  "address": "123 Street Name",
  "city": "Paris",
  "postalCode": "75001",
  "country": "France",
  "website": "https://autocare.com",
  "services": ["Oil Change", "Tire Service", "General Maintenance"],
  "averageRating": 4.5,
  "notes": "Recommended by friends",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

### TypeScript Interface Examples
- Each data model should have corresponding TypeScript interfaces in `src/types/`
- Include optional fields and required fields clearly
- Use discriminated unions for entity types
- Implement proper ID typing (use string UUIDs)

---

## Feature Specifications

### 1. Vehicle Management

#### 1.1 Vehicle List Screen
- **Purpose:** Display all vehicles owned by the user
- **HeroUI Components to Use:** Card, List, Button, Badge
- **Functionality:**
  - List all vehicles with name, brand, year, and license plate
  - Display vehicle status (active/inactive)
  - Show last oil change date and next scheduled date
  - Show next technical inspection due date with visual indicator
  - Add vehicle button (floating action button)
  - Edit/Delete options per vehicle (long press or swipe)
  - Filter/Sort options (by name, date added, year)

#### 1.2 Vehicle Detail Screen
- **Purpose:** View complete vehicle information and history
- **HeroUI Components:** Tabs, Card, Divider, Chip, Progress
- **Tabs:**
  - **Overview:** General vehicle info, current mileage, registration date
  - **Maintenance History:** Timeline of all maintenance records
  - **Oil Changes:** List of all oil changes with dates and costs
  - **Inspections:** Technical inspection records and due dates
  - **Stats:** Total maintenance costs, average cost per month, frequency statistics

#### 1.3 Create/Edit Vehicle Screen
- **Purpose:** Add new vehicle or modify existing information
- **HeroUI Components:** Input, Select, Textarea, Button, Spacer
- **Form Fields:**
  - Vehicle name
  - Brand (dropdown)
  - Model
  - Year (number input with validation)
  - License plate
  - Fuel type (dropdown: Petrol, Diesel, Hybrid, Electric)
  - Engine type
  - Oil type (dropdown)
  - Oil change interval in kilometers (customizable per vehicle)
  - Color
  - Additional notes
  - Vehicle image upload
- **Validation:** All required fields, format validation for license plate
- **Actions:** Save, Cancel, Delete (if editing)

### 2. Oil Change Management

#### 2.1 Oil Changes List Screen
- **Purpose:** View all oil changes across all vehicles or for specific vehicle
- **HeroUI Components:** Card, List, Button, Badge, Divider
- **Functionality:**
  - Display oil changes in reverse chronological order
  - Show vehicle name, date, mileage, cost, and oil type
  - Color-coded status:
    - Green: Next oil change > 3000km away
    - Yellow: Next oil change 1000-3000km away
    - Red: Next oil change due or overdue
  - Quick filters: By vehicle, date range, status
  - Search by vehicle name
  - Create new oil change button

#### 2.2 Oil Change Detail Screen
- **Purpose:** View complete oil change information
- **HeroUI Components:** Card, Divider, Button
- **Display:**
  - Vehicle information
  - Oil change date
  - Mileage at service
  - Oil type
  - Cost
  - Garage/center information
  - Next service date (calculated)
  - Next service mileage (calculated)
  - Notes/observations
- **Actions:** Edit, Delete, Share (export as text)

#### 2.3 Create/Edit Oil Change Screen
- **Purpose:** Record new oil change or modify existing record
- **HeroUI Components:** Input, Select, Textarea, Button, Spacer
- **Form Fields:**
  - Select vehicle (required, dropdown)
  - Select garage/center or create new (required)
  - Date of oil change (date picker, default today)
  - Mileage at service (number input)
  - Oil type (auto-filled from vehicle, editable)
  - Cost (decimal number)
  - Currency (dropdown, default EUR)
  - Next oil change date (auto-calculated, editable)
  - Next oil change mileage (auto-calculated from interval, editable)
  - Notes
- **Auto-calculations:**
  - Next date = Current date + customizable interval (months or based on previous intervals)
  - Next mileage = Current mileage + vehicle oil change interval

### 3. Maintenance Management

#### 3.1 Maintenance List Screen
- **Purpose:** View all maintenance records
- **HeroUI Components:** Card, List, Button, Badge, Chip
- **Functionality:**
  - Display all maintenance records chronologically
  - Show vehicle, date, type, cost, and status
  - Status indicators: Completed, Pending, In Progress
  - Color-coded by maintenance type
  - Quick filters: By vehicle, type, status, date range
  - Group by month or vehicle (toggle view)
  - Create maintenance record button

#### 3.2 Maintenance Detail Screen
- **Purpose:** View detailed maintenance information
- **HeroUI Components:** Card, Divider, Chip, Button
- **Display:**
  - Vehicle information
  - Maintenance type
  - Date performed
  - Mileage
  - Cost
  - Description/details
  - Parts replaced (list)
  - Technician name
  - Garage/center information
  - Status
  - Notes/observations
- **Actions:** Edit, Delete, Share

#### 3.3 Create/Edit Maintenance Screen
- **Purpose:** Record maintenance activity
- **HeroUI Components:** Input, Select, Textarea, Button, Chip, Spacer
- **Form Fields:**
  - Select vehicle (required)
  - Maintenance type (dropdown: Oil Change, Tire Service, Brake Service, General Inspection, etc., or custom)
  - Date of maintenance (date picker)
  - Mileage (number input)
  - Cost (decimal)
  - Currency
  - Description/details (textarea)
  - Parts replaced (array input - add/remove parts)
  - Technician name
  - Select garage/center or create new
  - Status (dropdown: Completed, Pending, In Progress)
  - Notes
- **Validation:** Vehicle and date required

### 4. Technical Inspection Management

#### 4.1 Inspections List Screen
- **Purpose:** Track technical inspection records
- **HeroUI Components:** Card, List, Button, Badge, Progress
- **Functionality:**
  - Display all inspections with vehicle, date performed, expiry date
  - Show days remaining until expiry (with visual progress indicator)
  - Color-coded urgency:
    - Green: > 90 days until expiry
    - Yellow: 30-90 days until expiry
    - Red: < 30 days or expired
  - Status indicators
  - Quick filters: By vehicle, status
  - Create inspection record button

#### 4.2 Inspection Detail Screen
- **Purpose:** View inspection information
- **HeroUI Components:** Card, Divider, Chip, Button, Progress
- **Display:**
  - Vehicle information
  - Inspection date
  - Expiry date with countdown
  - Mileage
  - Status
  - Result/comments
  - Certificate number
  - Cost
  - Inspection center information
  - Pass/Fail indicators with details
  - Notes

#### 4.3 Create/Edit Inspection Screen
- **Purpose:** Record technical inspection
- **HeroUI Components:** Input, Select, Textarea, Button, Spacer
- **Form Fields:**
  - Select vehicle (required)
  - Date of inspection (date picker)
  - Expiry date (date picker, typically +1 year)
  - Mileage
  - Status (dropdown: Passed, Failed, With Comments)
  - Result/comments (textarea)
  - Certificate number
  - Cost
  - Currency
  - Select inspection center or create new
  - Notes

### 5. Garage/Inspection Center Management

#### 5.1 Garage List Screen
- **Purpose:** Manage garage and inspection center contacts
- **HeroUI Components:** Card, List, Button, Badge
- **Functionality:**
  - Display all garages and inspection centers
  - Show name, city, phone, and type indicator
  - Show rating/recommendation status
  - Quick access to contact (call/email)
  - Add new garage button
  - Edit/Delete options

#### 5.2 Garage Detail Screen
- **Purpose:** View complete garage information
- **HeroUI Components:** Card, Divider, Link, Button, Chip
- **Display:**
  - Full address and contact information
  - Type (Garage, Inspection Center)
  - Services offered
  - Website link (if available)
  - Average rating/notes
  - Number of services used
  - Last service date
- **Actions:** Edit, Delete, Call, Email, Website

#### 5.3 Create/Edit Garage Screen
- **Purpose:** Add or modify garage information
- **HeroUI Components:** Input, Select, Textarea, Button, Spacer
- **Form Fields:**
  - Garage name (required)
  - Type (dropdown: Garage, Inspection Center)
  - Phone number
  - Email
  - Address (street)
  - City
  - Postal code
  - Country
  - Website (optional)
  - Services offered (multi-select or text input)
  - Rating/notes (textarea)
  - Additional notes

### 6. Home Dashboard Screen

#### 6.1 Overview
- **Purpose:** Quick summary of vehicle status and upcoming maintenance
- **HeroUI Components:** Card, Progress, Chip, Divider, Button
- **Sections:**
  - Active vehicles count
  - **Alerts/Notifications:**
    - Oil changes due or overdue (count + first 3)
    - Technical inspections expiring soon (< 30 days)
    - Pending maintenance
  - **Quick Stats:**
    - Total maintenance costs (current month/year)
    - Last maintenance by vehicle
    - Upcoming scheduled services
  - **Recent Activity:** Last 5 records across all categories
- **Actions:** Navigate to detail screens, create new record

---

## HeroUI Native Component Strategy

### Mandatory Component Usage

The application **must** utilize the following HeroUI Native components to maximize library benefits:

1. **Navigation & Layout**
   - `Card` - For all list items and information containers
   - `Divider` - Between sections
   - `Tabs` - For tabbed interfaces (vehicle details, home dashboard)
   - `Spacer` - For consistent spacing

2. **Forms & Input**
   - `Input` - Text fields
   - `Select` - Dropdowns
   - `Textarea` - Multi-line text
   - `Button` - Actions (Primary, Secondary, Danger)
   - `Checkbox` - Multi-selection (parts replaced)
   - `Radio` - Single selection (status)

3. **Data Display**
   - `Badge` - Status indicators, tags
   - `Chip` - Category/type indicators
   - `Progress` - Timelines, remaining days
   - `Image` - Vehicle images, thumbnails

4. **Feedback & Alerts**
   - `Modal` / `Popover` - Confirmations, details
   - `Toast` - Success/error messages (via custom wrapper)

5. **Structure & Organization**
   - `Container` - Main content wrapper
   - `Row` / `Col` - Layout grid
   - `List` / `ListItem` - Lists (if available)

### Customization & Theming

- Leverage HeroUI Native's **theme system** for consistent branding
- Create custom theme in `src/constants/theme.ts`
- Use Tailwind CSS variables for custom styling
- Implement dark mode support using HeroUI's theme toggle
- Define color palette aligned with modern mobile UX

---

## Data Persistence Strategy

### AsyncStorage Implementation

#### Storage Keys Convention
```typescript
// Format: entity:action:identifier
STORAGE_KEYS = {
  VEHICLES: 'vehicles:all',
  VEHICLE: 'vehicle:single',
  OIL_CHANGES: 'oilChanges:all',
  MAINTENANCE: 'maintenance:all',
  INSPECTIONS: 'inspections:all',
  GARAGES: 'garages:all',
  APP_STATE: 'app:state',
  USER_PREFERENCES: 'app:preferences'
}
```

#### Repository Pattern
- Create abstraction layer `AsyncStorageRepository` for all storage operations
- Implement CRUD operations: Create, Read, Update, Delete, List
- Handle JSON serialization/deserialization automatically
- Include error handling and data validation
- Support bulk operations for efficiency

#### Data Validation
- Validate data before storing
- Implement schema validation using TypeScript interfaces
- Handle legacy data formats during migration

### Migration Path to MongoDB
- **Design for MongoDB from start**: All local models match MongoDB schema
- Use UUID for IDs (compatible with MongoDB ObjectId format)
- Include `createdAt` and `updatedAt` timestamps in all entities
- Structure nested data appropriately (embed vs. reference decisions)
- Prepare API layer abstraction for future backend integration

---

## State Management & Hooks

### Custom Hooks Pattern

Create custom hooks for each entity type:
- `useVehicles()` - CRUD operations on vehicles
- `useOilChanges()` - Oil change management
- `useMaintenance()` - Maintenance management
- `useInspections()` - Inspection management
- `useGarages()` - Garage management

Each hook should return:
```typescript
{
  data: T[],
  loading: boolean,
  error: string | null,
  create: (data: T) => Promise<T>,
  update: (id: string, data: Partial<T>) => Promise<T>,
  delete: (id: string) => Promise<void>,
  getById: (id: string) => T | undefined,
  refresh: () => Promise<void>
}
```

### Generic AsyncStorage Hook
Implement reusable `useAsyncStorage` hook for simple key-value storage operations.

---

## Navigation Architecture

### Navigation Structure
- Use **Expo Router** (file-based routing)
- Implement native stack navigation
- Tab-based navigation for main sections (if beneficial)
- Modal navigation for create/edit screens
- Deep linking support for direct access to records

### Navigation Flows
1. **Home → Vehicle → Maintenance/Oil Changes/Inspections**
2. **Garage Management → Create/Edit Garage**
3. **Create Modal Flows** for quick data entry
4. **Settings & About** section

---

## UI/UX Guidelines

### Design System Alignment
- Follow HeroUI Native **design tokens**
- Use consistent spacing, typography, and color
- Implement responsive layouts for different screen sizes
- Support both light and dark themes

### User Experience Principles
- **Minimal taps to record data** - streamlined creation flows
- **Clear visual feedback** - success/error notifications
- **Intuitive navigation** - logical information hierarchy
- **Accessibility** - proper contrast, touch target sizes (minimum 48dp)
- **Performance** - smooth animations, quick data operations

### Offline-First Experience
- All operations work offline using AsyncStorage
- Indicate sync status when backend is added
- Queue operations for later sync if needed

---

## Implementation Guidelines for Claude Code

### Before Implementation
1. **Read this entire specification** to understand the complete system
2. **Study the directory structure** to understand organization
3. **Review data models** to understand entity relationships
4. **Understand HeroUI Native components** from official documentation

### During Implementation

#### Phase 1: Foundation (Priority: Critical)
1. Set up project structure exactly as specified
2. Create TypeScript interfaces and types
3. Implement AsyncStorageRepository abstraction
4. Create data models and validation
5. Build custom hooks for data access

#### Phase 2: Screens & Components (Priority: High)
1. Create shared HeroUI components (Header, FAB, EmptyState, etc.)
2. Implement Vehicle Management screens
3. Implement Oil Changes screens
4. Implement Maintenance screens
5. Implement Inspections screens
6. Implement Garage Management screens
7. Implement Home Dashboard

#### Phase 3: Integration & Polish (Priority: Medium)
1. Navigation implementation
2. Theme and styling refinement
3. Error handling and validation
4. Loading states and animations
5. Testing data flows

### Component Development Rules
1. **Always use HeroUI Native components** - avoid native defaults
2. **Create reusable components** - don't repeat UI logic
3. **Implement proper TypeScript types** - strict typing everywhere
4. **Use hooks for logic** - keep components focused on rendering
5. **Add proper error boundaries** - graceful error handling
6. **Include loading states** - smooth user feedback

### Code Quality Standards
- Use **functional components** with hooks exclusively
- Follow **React best practices** (proper dependency arrays, key props)
- Implement **proper error handling** throughout
- Add **console.error/log** for debugging (use appropriate log levels)
- Create **modular, testable code** (minimal component coupling)
- **Comment complex logic** but keep code self-documenting

### Testing Considerations
- Prepare components for unit testing (injectable dependencies)
- Design services for easy mocking
- Implement error scenarios handling
- Prepare data for edge cases

---

## Performance Optimization

### Data Operations
- Implement pagination/virtualization for large lists
- Batch AsyncStorage operations where possible
- Use React.memo for expensive component re-renders
- Optimize re-renders with useCallback and useMemo

### Bundle Size
- Tree-shake unused HeroUI Native components
- Lazy load screens where appropriate
- Minimize unnecessary dependencies
- Optimize images and assets

---

## Error Handling & Validation

### Validation Strategy
- Implement validation in service layer
- Validate before storage operations
- Provide clear error messages to users
- Log errors for debugging

### Error Types to Handle
- Invalid input data
- Storage operation failures
- Missing required fields
- Duplicate entries (license plate, names)
- Data corruption scenarios

---

## Future Considerations

### MongoDB Integration
- Prepare service layer for API calls
- Implement repository adapter for API backend
- Design authentication flow
- Plan for data syncing strategy

### Feature Extensions
- Photo gallery for vehicles
- Fuel consumption tracking
- Expense analytics and reports
- Reminders for upcoming services
- Multi-user support
- Cloud backup

---

## Success Criteria

The implementation is successful when:
1. ✅ All core entities (Vehicle, Oil Change, Maintenance, Inspection, Garage) fully functional
2. ✅ All CRUD operations work correctly with AsyncStorage
3. ✅ HeroUI Native components used for 90%+ of UI
4. ✅ Data persists across app restarts
5. ✅ TypeScript strict mode passes without errors
6. ✅ Navigation flows are intuitive and complete
7. ✅ Error handling prevents crashes
8. ✅ Code follows modular, layered architecture
9. ✅ Responsive design works on various screen sizes
10. ✅ Performance is smooth (60 FPS for scrolling/animations)

---

## Deliverables Checklist

- [ ] Complete project structure with all directories
- [ ] All TypeScript type definitions and interfaces
- [ ] AsyncStorage repository layer fully implemented
- [ ] All service/business logic implemented
- [ ] Custom hooks for data access
- [ ] Home dashboard screen
- [ ] Vehicle management screens (list, detail, create/edit)
- [ ] Oil change management screens
- [ ] Maintenance management screens
- [ ] Technical inspection screens
- [ ] Garage/center management screens
- [ ] Navigation configuration with Expo Router
- [ ] Theme configuration for HeroUI Native
- [ ] Error handling and validation throughout
- [ ] Loading and empty states for all screens
- [ ] Working demo with sample data

---

## Notes for Claude Code Agent

### Critical Success Factors

1. **Maximum HeroUI Native Usage** - This is not optional. Use HeroUI components for all UI elements. The goal is to showcase HeroUI Native capabilities.

2. **Modular Architecture** - Separate concerns strictly. Services shouldn't know about UI. Components shouldn't contain business logic. This enables testing and maintenance.

3. **Type Safety** - Strict TypeScript. All data should be properly typed. This prevents bugs and enables IDE assistance.

4. **Data-First Design** - Think about data schema and flows before UI. The data structure must be MongoDB-ready from the beginning.

5. **User Experience** - Focus on smooth, responsive interactions. Minimize friction in data entry. Provide clear feedback.

6. **Offline-First Mentality** - All features must work offline. AsyncStorage is not a temporary solution; it's the local database.

### Preferred Development Approach

1. Start with **data models and types** - get the schema right first
2. Implement **service layer** - business logic and validation
3. Build **repository layer** - data access abstraction
4. Create **custom hooks** - data access for components
5. Develop **reusable components** - using HeroUI Native
6. Build **screens** - integrating components with hooks
7. Set up **navigation** - connect all screens
8. Polish **theme and styling** - ensure consistency
9. Test **complete flows** - end-to-end functionality

### When Making Decisions

- **Choose composition over inheritance** - React patterns favor composition
- **Prefer explicit over implicit** - code should be self-documenting
- **Default to strict typing** - TypeScript strict mode
- **Optimize for reading** - code is read more than written
- **Think in components** - break down into small, focused pieces

### Common Pitfalls to Avoid

- ❌ Mixing UI logic with business logic
- ❌ Creating overly complex components
- ❌ Not handling loading and error states
- ❌ Storing sensitive data in AsyncStorage unencrypted
- ❌ Ignoring TypeScript warnings
- ❌ Creating global state for everything
- ❌ Not validating user input
- ❌ Over-engineering early solutions

---

## Questions to Address During Development

Before implementing any feature, answer:
1. What data needs to be stored?
2. Where does this data come from?
3. Who uses this data and why?
4. What are the validation rules?
5. How does this integrate with other features?
6. What happens when this fails?
7. How do we show progress/results to the user?

---

## References & Resources

- **HeroUI Native Documentation**: Comprehensive component library documentation
- **React Native Best Practices**: Established patterns for mobile development
- **Expo Documentation**: Framework and CLI reference
- **TypeScript Documentation**: Type system reference
- **AsyncStorage Documentation**: Local storage API reference

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Ready for Implementation  
**Target Development Environment:** React Native + Expo + HeroUI Native