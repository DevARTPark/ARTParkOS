# ARTPark Execution Toolkit

A professional, minimal, and extensible frontend for a toolkit that supports robotics & AI startups. This is a UI-only implementation built with React, TypeScript, and TailwindCSS.

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Recharts** - Chart library (ready for use)

## Project Structure

```
src/
  components/       # Reusable UI components
    ui/            # Base UI primitives (Button, Card, Input, etc.)
    suppliers/     # Supplier-specific components (RFQModal)
  pages/           # Page components (one file per page)
    auth/          # Authentication pages
    suppliers/     # Supplier pages
    labs/          # Test lab pages
    facilities/    # Facility booking pages
    mentors/       # Mentor pages
    software/      # Software licensing pages
    knowledge/     # Knowledge AI page
  layouts/         # Layout components (AuthLayout, DashboardLayout)
  hooks/           # Custom React hooks (ready for use)
  utils/           # Utility functions (cn, auth)
  data/            # Mock JSON data files
  api/             # Mock API functions (simulated latency)
  styles/          # Global styles
  router/          # Router configuration (in App.tsx)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Features

### Authentication
- Login page with email/password and Google SSO button
- Signup page with role selection (admin/startup)
- Simple mock authentication (localStorage-based)

### Dashboard
- Quick stats cards
- Recent bookings and RFQs
- Quick action cards for navigation

### Supplier Intelligence
- Supplier list with search and filters
- Supplier detail pages with full profiles
- RFQ (Request for Quote) modal
- Supplier comparison page (compare up to 3 suppliers)

### Test Lab Finder
- Lab listing with search and filters
- Lab detail pages with facilities and test types
- Booking widget and confirmation pages

### In-House Facility Booking
- Equipment listing with filters
- Equipment detail pages with specifications and safety notes
- Booking widget and confirmation

### Mentor & Expert Booking
- Mentor listing with search
- Mentor profiles with expertise tags
- Session booking and confirmation

### Software Licensing Portal
- Software listing with filters
- Software detail pages
- Access request modal
- Request status tracking page

### ARTPark Knowledge AI
- Chat-style interface
- Simple RAG placeholder (keyword-based matching)
- Links to relevant suppliers/labs/mentors

### Utility Pages
- Profile page (edit user information)
- Notifications page
- 404 Not Found page

## Mock Data

All data is stored in JSON files under `src/data/`:
- `suppliers.json` - Supplier information
- `mentors.json` - Mentor profiles
- `labs.json` - Test lab details
- `equipment.json` - Facility equipment
- `software.json` - Software tools
- `users.json` - User data

## Mock API

The `src/api/mockApi.ts` file contains async functions that simulate API calls with realistic latency (300-800ms). All functions return promises and can be easily replaced with real API calls.

### API Functions Available:
- `suppliersApi.getAll()`, `getById()`, `search()`
- `mentorsApi.getAll()`, `getById()`, `search()`
- `labsApi.getAll()`, `getById()`, `search()`
- `equipmentApi.getAll()`, `getById()`, `search()`
- `softwareApi.getAll()`, `getById()`, `search()`
- `bookingApi.createLabBooking()`, `createFacilityBooking()`, `createMentorBooking()`
- `rfqApi.create()`
- `softwareRequestApi.create()`, `getAll()`

## Backend Integration Points

When integrating with a real backend, replace the mock API calls in:

1. **API Layer** (`src/api/mockApi.ts`)
   - Replace all functions with actual HTTP requests (fetch/axios)
   - Update return types to match backend responses
   - Add proper error handling

2. **Authentication** (`src/utils/auth.ts`)
   - Replace localStorage with secure token storage
   - Add token refresh logic
   - Integrate with backend auth endpoints

3. **Data Fetching**
   - All pages use hooks/effects that call mockApi functions
   - Replace these calls with real API endpoints
   - Add loading states and error handling (already scaffolded)

4. **Form Submissions**
   - Booking forms, RFQ forms, software requests
   - Currently use mockApi - replace with POST requests

5. **Search & Filters**
   - Currently client-side filtering
   - Move to server-side search/filtering for better performance

6. **Real-time Features**
   - Notifications (currently static)
   - Chat updates (Knowledge AI)
   - Booking status updates

## Component Library

The project uses a custom component library built with TailwindCSS. Key components:

- **Button** - Multiple variants (primary, secondary, outline, ghost, danger)
- **Card** - Container with header, content, footer
- **Input** - Form input with label and error states
- **Select** - Dropdown select component
- **Modal** - Dialog/modal component
- **SearchBar** - Search input with icon
- **FilterBar** - Active filters display
- **ListSkeleton** - Loading skeleton for lists
- **DetailHeader** - Page header with back button
- **CompareTable** - Side-by-side comparison table
- **ChatWidget** - Chat interface component
- **BookingWidget** - Booking form component

## Styling

- TailwindCSS for all styling
- Custom color palette with primary colors
- Responsive design (mobile-first approach)
- Consistent spacing and typography
- Accessible components (keyboard navigation, focus states)

## Development Notes

- All components are TypeScript-typed
- Mock data includes realistic sample data
- Loading states and error handling are implemented
- Forms include validation
- Routing is protected (auth guard)
- Mobile-responsive design throughout

## Next Steps

1. **Backend Integration**
   - Set up API endpoints
   - Replace mockApi functions
   - Add authentication middleware
   - Implement real-time features

2. **Enhanced Features**
   - Calendar integration for bookings
   - File uploads for RFQs
   - Advanced search with filters
   - Export functionality (PDF reports, etc.)

3. **Testing**
   - Unit tests for components
   - Integration tests for flows
   - E2E tests for critical paths

4. **Performance**
   - Code splitting
   - Image optimization
   - Lazy loading
   - Caching strategies

## License

This project is part of the ARTPark Execution Toolkit.
