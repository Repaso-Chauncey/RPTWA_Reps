# Design Document: Calisthenics Theme Transformation

## Overview

This design document outlines the transformation of the Baseball PWA application into a Calisthenics-themed fitness tracking application. The transformation involves three main areas:

1. **Database Renaming**: Changing the database name from `baseball_pwa` to `calisthenics-reps`
2. **Visual Theme Update**: Implementing a black and yellow color palette
3. **Content Rebranding**: Updating all text, categories, and branding to reflect calisthenics/fitness theme

The changes are primarily configuration and styling updates with minimal impact on core application logic.

## Architecture

The existing architecture remains unchanged. The transformation affects:

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   CSS Files │  │ Components  │  │   PWA Manifest      │ │
│  │  (Colors)   │  │ (Branding)  │  │   (App Name)        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server (Express)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  .env Files │  │  server.js  │  │   Database Config   │ │
│  │  (DB_NAME)  │  │  (Logging)  │  │   (Connection)      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                           │
│              calisthenics-reps (renamed)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  tasks table: category ENUM updated                  │   │
│  │  ('push-ups','pull-ups','squats','core',            │   │
│  │   'stretching','other')                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Files to Modify

#### Environment Configuration Files
| File | Changes |
|------|---------|
| `.env` | DB_NAME=calisthenics-reps, updated secrets |
| `.env.development` | DB_NAME=calisthenics_reps_dev, updated secrets |
| `.env.production` | DB_NAME=calisthenics-reps, updated secrets |

#### Database Files
| File | Changes |
|------|---------|
| `server/database/database.sql` | Database name, category ENUM values |

#### Server Files
| File | Changes |
|------|---------|
| `server/server.js` | Console logs, health check message |
| `server/config/database.js` | Default database name fallback |

#### Client CSS Files
| File | Changes |
|------|---------|
| `client/src/index.css` | Base colors |
| `client/src/pages/Dashboard.css` | Yellow accents, hover states |
| `client/src/pages/Tasks.css` | Yellow accents, hover states |
| `client/src/pages/Profile.css` | Yellow accents, hover states |
| `client/src/components/Navbar.css` | Yellow accents, brand colors |
| `client/src/pages/BaseballGame.css` | Yellow accents (renamed to CalisthenicsGame.css) |

#### Client Component Files
| File | Changes |
|------|---------|
| `client/src/components/Navbar.js` | Brand name text |
| `client/src/pages/BaseballGame.js` | Rename to CalisthenicsGame.js, update content |
| `client/src/App.js` | Import renamed game component |
| `client/public/manifest.json` | App name, theme color |

## Data Models

### Task Category ENUM Update

**Before (Baseball):**
```sql
ENUM('training', 'game', 'equipment', 'team_meeting', 'other')
```

**After (Calisthenics):**
```sql
ENUM('push-ups', 'pull-ups', 'squats', 'core', 'stretching', 'other')
```

### Color Palette Definition

| Color Role | Hex Value | Usage |
|------------|-----------|-------|
| Primary Background | #000000 | Page backgrounds, dark sections |
| Secondary Background | #1a1a1a | Gradients, cards |
| Accent Color | #FFD700 | Buttons, highlights, interactive elements |
| Accent Hover | #FFC000 | Hover states |
| Text Primary | #FFFFFF | Text on dark backgrounds |
| Text Secondary | #E0E0E0 | Muted text on dark backgrounds |
| Card Background | #FFFFFF or rgba(255,255,255,0.98) | Content cards |
| Border Accent | #FFD700 | Active/highlighted borders |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, most acceptance criteria are configuration/example-based tests rather than universal properties. The following properties can be verified:

### Property 1: Database Name Consistency
*For any* environment configuration file in the project, the DB_NAME value SHALL match the expected database name pattern (calisthenics-reps for production, calisthenics_reps_dev for development).
**Validates: Requirements 1.1, 1.3, 5.1, 5.2, 5.3**

### Property 2: Color Palette Consistency
*For any* CSS file that defines interactive element styles (buttons, links), the accent color values SHALL be yellow (#FFD700 or equivalent).
**Validates: Requirements 2.2, 2.5**

### Property 3: Brand Name Consistency
*For any* user-facing text that displays the application name, the text SHALL contain "Calisthenics" and not contain "Baseball".
**Validates: Requirements 4.1, 4.4**

### Property 4: Category ENUM Consistency
*For any* task category definition (database schema or frontend), the categories SHALL include calisthenics-themed values ('push-ups', 'pull-ups', 'squats', 'core', 'stretching', 'other').
**Validates: Requirements 3.1, 3.2**

## Error Handling

This transformation is primarily a theming/configuration change with minimal error handling requirements:

1. **Database Connection**: If the renamed database doesn't exist, the application will fail to connect. The existing error handling in `database.js` will log the connection failure.

2. **Missing Environment Variables**: The existing `environment.js` validation will catch missing required variables.

3. **CSS Fallbacks**: CSS changes don't require error handling as browsers gracefully handle missing styles.

## Testing Strategy

### Unit Testing Approach

Unit tests will verify specific configuration values and content:

1. **Environment File Tests**: Verify DB_NAME values in each environment file
2. **SQL Schema Tests**: Verify database name and ENUM values in SQL file
3. **Manifest Tests**: Verify PWA manifest contains correct app name and theme color
4. **Component Content Tests**: Verify brand text in Navbar and other components

### Property-Based Testing Approach

Property-based testing library: **Jest with custom matchers** (already in use in the project)

Property tests will verify:

1. **Database Name Property**: Generate variations of environment configs and verify DB_NAME pattern
2. **Color Consistency Property**: Parse CSS files and verify accent colors match the yellow palette
3. **Brand Consistency Property**: Search all user-facing strings for brand references

Each property-based test will:
- Run a minimum of 100 iterations where applicable
- Be tagged with format: `**Feature: calisthenics-theme, Property {number}: {property_text}**`
- Reference the specific correctness property from this design document

### Test File Structure

```
server/
  config/
    environment.test.js  (update existing)
client/
  src/
    __tests__/
      theme.test.js      (new - color and brand tests)
```

### Visual Verification

Manual verification checklist:
- [ ] All pages display black background
- [ ] Interactive elements show yellow accent color
- [ ] Hover states provide yellow feedback
- [ ] Brand name shows "Calisthenics Reps"
- [ ] Game page shows calisthenics content
