# CLAUDE.md - CarNote Project Memory

## Quick Start Commands

```bash
# Install dependencies
yarn install

# Start development server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Format code
npx prettier --write .

# Type checking
npx tsc --noEmit
```

## Project Quick Facts

- **App Name:** CarNote
- **Type:** React Native Mobile Application
- **Framework:** React Native with Expo (latest)
- **UI Library:** HeroUI Native (MANDATORY - use for 90%+ of UI)
- **Language:** TypeScript (strict mode)
- **State Management:** React Hooks + Custom Hooks
- **Data Storage:** AsyncStorage (JSON local storage)
- **Navigation:** Expo Router (file-based routing)
- **Styling:** Tailwind CSS via Uniwind + HeroUI Native themes

## Architecture Layers (CRITICAL)

```
Presentation Layer (Screens, HeroUI Components)
         ↓
Business Logic Layer (Services, Validation)
         ↓
Data Access Layer (Repositories, AsyncStorage)
         ↓
Infrastructure Layer (Utils, Constants, Logging)
```

## Directory Structure Map

```
src/
├── app/              → Navigation screens (Expo Router)
├── components/       → Reusable HeroUI components
├── services/         → Business logic
├── repositories/     → Data access (AsyncStorage)
├── hooks/            → Custom React hooks
├── types/            → TypeScript interfaces
├── constants/        → App constants
└── utils/            → Utility functions
```

## Core Entities

1. **Vehicle** - Cars to track (name, brand, year, oil interval, etc.)
2. **Oil Change** - Service records with dates, costs, next intervals
3. **Maintenance** - General maintenance records (repairs, parts, etc.)
4. **Inspection** - Technical inspection records with expiry dates
5. **Garage** - Service centers/inspection locations

## HeroUI Native Components (PRIMARY USAGE)

**MUST USE:** Card, Button, Input, Select, Divider, Tabs, Badge, Chip, Progress, Spacer

For forms: Input, Select, Textarea, Button  
For lists: Card, Badge, Divider  
For data: Progress, Chip, Image  
For layout: Spacer, Container, Tabs

## AsyncStorage Pattern

- Use Repository pattern for all storage operations
- Keys follow format: `entity:action:identifier`
- All data serialized to JSON
- Include timestamps (createdAt, updatedAt) in all entities
- UUID for IDs (compatible with MongoDB)

## Key Files to Know

- `src/repositories/AsyncStorageRepository.ts` → Main storage abstraction
- `src/types/*.ts` → All TypeScript interfaces
- `src/constants/theme.ts` → HeroUI Native theme configuration
- `src/hooks/useAsyncStorage.ts` → Generic storage hook
- `src/app/_layout.tsx` → Main navigation setup

## Code Style Rules

✅ DO:

- Use functional components with hooks only
- Create modular, reusable components
- Implement proper error boundaries
- Use TypeScript strict types
- Follow HeroUI Native component patterns
- Keep components focused on rendering
- Put business logic in services/hooks

❌ DON'T:

- Mix UI logic with business logic
- Create class components
- Use global state for everything
- Skip TypeScript types
- Ignore error handling
- Create overly complex components
- Store sensitive data in AsyncStorage

## Common Tasks

### Adding New Entity

1. Create TypeScript interface in `src/types/`
2. Create repository in `src/repositories/`
3. Create service in `src/services/`
4. Create custom hook in `src/hooks/`
5. Create components in `src/components/`
6. Create screens in `src/app/`

### Creating New Screen

1. Create screen file in `src/app/[section]/[screen].tsx`
2. Import HeroUI components
3. Use custom hook for data
4. Implement with HeroUI Native components
5. Add error and loading states
6. Include proper navigation

### Debugging AsyncStorage

```typescript
// Get all keys
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getAllKeys().then((keys) => console.log('Storage keys:', keys));

// Debug single key
AsyncStorage.getItem('vehicles:all').then((data) => console.log(data));
```

## Performance Tips

- Use React.memo for expensive components
- Implement useCallback for event handlers
- Optimize list rendering with FlatList
- Batch AsyncStorage operations
- Lazy load screens where possible
- Use progressive disclosure for complex data

## Testing Quick Reference

- Services should be pure functions (testable)
- Repositories should handle data access
- Components should be focused on rendering
- Hooks should be testable with React Testing Library
- Mock AsyncStorage for unit tests

## Common Error Scenarios to Handle

- Missing required fields in forms
- Duplicate license plates
- Invalid dates
- Storage operation failures
- Missing vehicle references
- Invalid mileage progression
- Network failures (when backend added)

## Future Migration to MongoDB

- All data already uses MongoDB-compatible schema
- UUID format ready for ObjectId migration
- Timestamps (createdAt, updatedAt) already present
- Service layer prepared for API abstraction
- Repository pattern enables easy backend swap

## Accessibility Checklist

- ✅ Minimum touch target: 48dp
- ✅ Color contrast: WCAG AA
- ✅ Semantic labels for form inputs
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

## Important Notes for This Project

1. **HeroUI Native is MANDATORY** - This demonstrates component library capabilities
2. **Offline-first design** - All features work without network
3. **Type safety is non-negotiable** - Strict TypeScript throughout
4. **Modular architecture required** - Enables testing and maintenance
5. **Data validation critical** - Prevent invalid states
6. **User experience matters** - Smooth, responsive interactions

## Troubleshooting

- **AsyncStorage not persisting?** → Check JSON serialization, verify key names
- **HeroUI components not appearing?** → Verify Uniwind setup, check imports
- **Navigation errors?** → Check Expo Router file structure, verify imports
- **Performance slow?** → Check list rendering, look for unnecessary re-renders
- **Types not working?** → Run `npx tsc --noEmit`, check strict mode

## Resources

- HeroUI Native: Official component documentation
- Expo: Framework and Router documentation
- React Native: Core platform documentation
- AsyncStorage: Local storage API documentation
- Expo Router: File-based routing documentation

## Quick Reference: Feature Checklist

- [ ] Vehicle CRUD operations
- [ ] Oil change tracking and calculations
- [ ] Maintenance records
- [ ] Technical inspections
- [ ] Garage management
- [ ] Home dashboard with alerts
- [ ] Date calculations and intervals
- [ ] Cost tracking and analytics
- [ ] Responsive design
- [ ] Dark mode support

## Important: Development Flow

1. Think about data structure FIRST
2. Define TypeScript interfaces
3. Implement repository/service
4. Create custom hook
5. Build HeroUI components
6. Connect in screen
7. Test complete flow
8. Add error handling
9. Polish UX
10. Optimize performance
