# Claude Code Implementation Prompt Template

## How to Use This Document

Copy the text below and paste it into Claude Code. This prompt is specifically engineered for maximum effectiveness with Claude Code's code generation capabilities.

---

## PROMPT TO GIVE TO CLAUDE CODE

I'm developing a React Native mobile application called **CarNote** using Expo and HeroUI Native. I need you to implement the complete application according to a comprehensive technical specification.

### CRITICAL PROJECT PARAMETERS

**Technology Stack (Non-negotiable):**
- React Native with Expo (latest stable version)
- HeroUI Native for 90%+ of all UI components
- TypeScript with strict mode enabled
- AsyncStorage for local JSON-based data persistence (prepared for MongoDB migration)
- Expo Router for file-based navigation
- Tailwind CSS via Uniwind configuration

**Architecture Requirement:**
Implement strict layered architecture:
```
Presentation Layer → Business Logic Layer → Data Access Layer → Infrastructure Layer
```

### APPLICATION OVERVIEW

**Purpose:** CarNote tracks vehicle maintenance including oil changes, general maintenance, technical inspections, and garage contacts across single or multiple vehicles.

**Core Data Entities:**
1. Vehicle (brand, model, year, oil change interval, fuel type, etc.)
2. Oil Change (date, mileage, cost, next interval, garage reference)
3. Maintenance (type, date, mileage, cost, parts, status)
4. Technical Inspection (date performed, expiry date, certificate, status)
5. Garage (name, contact info, services, location)

### IMPLEMENTATION REQUIREMENTS

#### 1. Project Structure (EXACT)
Create this directory structure in `src/`:
- `app/` - Expo Router screens (navigation-based file structure)
- `components/` - Reusable HeroUI Native components
- `services/` - Business logic and validation
- `repositories/` - AsyncStorage data access abstraction
- `hooks/` - Custom React hooks for data management
- `types/` - TypeScript interfaces and types
- `constants/` - Application constants and theme configuration
- `utils/` - Utility functions for dates, currency, etc.

#### 2. Data Models (TypeScript Interfaces)
Create TypeScript interfaces for all entities with:
- UUID IDs
- createdAt and updatedAt timestamps
- Proper type safety
- All relationships properly typed

#### 3. AsyncStorage Repository Layer
Implement `AsyncStorageRepository` class with:
- Generic CRUD operations (Create, Read, Update, Delete, List)
- JSON serialization/deserialization
- Error handling
- Batch operations support
- Storage key management

Entity-specific repositories that extend or use the generic repository.

#### 4. Service Layer
Create service classes for each entity with:
- Business logic (calculations, validations)
- Data transformations
- Validation rules
- Cost calculations
- Date interval calculations for oil changes
- Auto-calculation of next service dates and mileages

#### 5. Custom Hooks
Implement custom hooks for each entity (`useVehicles`, `useOilChanges`, `useMaintenance`, `useInspections`, `useGarages`) that provide:
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

#### 6. HeroUI Native Components (MANDATORY USAGE)

**Navigation & Layout:**
- Card - All list items, containers
- Divider - Section separators
- Tabs - Multi-view screens
- Spacer - Consistent spacing

**Forms & Input:**
- Input - Text fields
- Select - Dropdowns
- Textarea - Multi-line text
- Button - All actions
- Checkbox - Multi-select
- Radio - Single select

**Data Display:**
- Badge - Status indicators
- Chip - Tags/categories
- Progress - Timelines, remaining days
- Image - Vehicle photos

**Special Requirements:**
- Create custom Alert/Toast component wrapper (HeroUI Native may not have built-in)
- Implement EmptyState component for empty lists
- Create LoadingSpinner component
- Create ConfirmDialog component for deletions

#### 7. Screen Implementation

**Home Dashboard Screen:**
- Quick stats (active vehicles, total maintenance costs)
- Alerts for oil changes due/overdue
- Alerts for inspections expiring soon
- Recent activity feed
- Navigation buttons to main features

**Vehicle Management:**
- Vehicle list screen (with filter/sort)
- Vehicle detail screen (tabs: overview, maintenance history, oil changes, inspections, stats)
- Create/Edit vehicle screen (form with validation)

**Oil Change Management:**
- Oil changes list (chronological, color-coded status)
- Oil change detail screen
- Create/Edit oil change screen with auto-calculations
- Status color coding (Green: >3000km away, Yellow: 1000-3000km, Red: Due/Overdue)

**Maintenance Management:**
- Maintenance list (with filters, grouping options)
- Maintenance detail screen
- Create/Edit maintenance screen (with parts array input)

**Technical Inspection Management:**
- Inspections list (with expiry date indicators)
- Inspection detail screen with countdown
- Create/Edit inspection screen
- Visual urgency indicators (Green: >90 days, Yellow: 30-90 days, Red: <30 days)

**Garage/Center Management:**
- Garage list screen
- Garage detail screen with contact info
- Create/Edit garage screen

#### 8. Navigation Setup (Expo Router)
Implement file-based routing structure:
```
app/
├── _layout.tsx (root navigation)
├── index.tsx (home)
├── vehicles/
│   ├── _layout.tsx
│   ├── index.tsx (list)
│   ├── [vehicleId].tsx (detail)
│   └── create.tsx
├── oil-changes/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── [oilChangeId].tsx
│   └── create.tsx
[... similar for maintenance, inspections, garages ...]
```

#### 9. Error Handling & Validation
- Implement validation service with rules for all entities
- Proper error messages for user feedback
- Error boundaries for crash prevention
- Loading states for all async operations
- Empty states for empty lists

#### 10. Theme & Styling
- Configure HeroUI Native theme in `src/constants/theme.ts`
- Support light and dark modes
- Use Tailwind CSS variables for custom colors
- Ensure responsive design for various screen sizes
- Consistent spacing and typography throughout

### DEVELOPMENT PRIORITIES

**Phase 1 - CRITICAL:**
1. Project structure and TypeScript setup
2. Data models and interfaces
3. AsyncStorage repository layer
4. Service layer with business logic
5. Custom hooks for data access

**Phase 2 - HIGH PRIORITY:**
6. Reusable HeroUI components
7. All screens with proper layout
8. Navigation setup
9. Error handling and validation

**Phase 3 - ENHANCEMENT:**
10. Theme customization
11. Loading/empty states
12. Performance optimization
13. Testing data and edge cases

### SPECIFIC IMPLEMENTATION DETAILS

**Auto-Calculations Required:**
- Next oil change date: Current date + configurable interval (months)
- Next oil change mileage: Current mileage + vehicle oil change interval
- Days until inspection expiry: expiry_date - today
- Total maintenance cost: Sum of all maintenance records
- Monthly cost average: Total cost / months with records

**Data Validation Rules:**
- License plate format and uniqueness (within vehicle list)
- Mileage must be progressive (can't decrease)
- Oil change interval must be > 0
- Future dates for next services
- Email format if provided
- Phone number format if provided

**UI/UX Requirements:**
- Minimum touch target size: 48dp
- All inputs have placeholder text
- Form validation shows error messages
- Success/error feedback for operations
- Loading spinners for async operations
- Smooth animations for transitions
- Pull-to-refresh on list screens
- Search/filter functionality on lists

### CODE QUALITY REQUIREMENTS

- Functional components only (no class components)
- React hooks exclusively
- Proper TypeScript types (no 'any')
- Error boundaries on screens
- Proper cleanup in useEffect
- useCallback for event handlers
- useMemo for expensive calculations
- Modular, reusable functions
- Clear, self-documenting code
- Proper key props in lists

### TESTING & SAMPLE DATA

Include sample data initialization for testing:
- 2-3 sample vehicles with complete data
- Multiple oil change records per vehicle
- Various maintenance types and statuses
- Technical inspection records with different expiry dates
- Sample garages with complete contact info

Implement data reset functionality for development/testing.

### DELIVERABLES CHECKLIST

Ensure ALL of the following are implemented:
- [x] Complete project structure as specified
- [x] All TypeScript types and interfaces
- [x] AsyncStorage repository with full CRUD
- [x] Service layer with all business logic
- [x] Custom hooks for all entities
- [x] Home dashboard screen
- [x] Vehicle management (list, detail, create/edit)
- [x] Oil change management (complete)
- [x] Maintenance management (complete)
- [x] Inspection management (complete)
- [x] Garage management (complete)
- [x] Navigation with Expo Router
- [x] HeroUI Native components used throughout
- [x] Error handling and validation
- [x] Loading and empty states
- [x] Theme configuration
- [x] Working demo with sample data

### CRITICAL SUCCESS FACTORS

1. **HeroUI Native Usage:** Minimum 90% of UI must use HeroUI Native components. This is not optional.
2. **Layered Architecture:** Strict separation of concerns. No mixing of UI, business, and data logic.
3. **Type Safety:** Strict TypeScript throughout. No 'any' types. Proper interfaces for all data.
4. **AsyncStorage Integration:** All data persists correctly. JSON serialization/deserialization works properly.
5. **Complete Implementation:** All 5 core entities fully functional with all CRUD operations.

### IF YOU ENCOUNTER AMBIGUITIES

When uncertain about implementation details, make decisions that:
- Prioritize HeroUI Native component usage
- Keep code modular and testable
- Follow React/React Native best practices
- Ensure type safety
- Provide good user experience
- Maintain layered architecture

---

## ADDITIONAL CONTEXT FOR CLAUDE CODE

You have access to:
1. **Complete Technical Specification** - CarNote-Spec.md (comprehensive feature requirements)
2. **Project Memory Document** - CLAUDE.md (quick reference and commands)
3. **All necessary file paths and structure definitions** in this prompt

Reference the specification document for detailed feature requirements and component specifications. Use CLAUDE.md for quick reminders about commands, architecture, and common tasks.

---

## NEXT STEPS AFTER RECEIVING THIS PROMPT

After you provide the implementation:
1. Verify all file structure matches the specification
2. Check that HeroUI Native components are used throughout
3. Test complete data flows (create vehicle → add oil change → view stats)
4. Verify AsyncStorage persistence across app restarts
5. Ensure all error handling is in place
6. Check responsive design on various screen sizes
7. Validate TypeScript strict mode compliance