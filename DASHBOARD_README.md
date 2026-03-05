# Dashboard Application

A fully customizable, responsive dashboard application built with React, TypeScript, and Material-UI.

## Features

### 1. Dashboard Layout Configuration
- **User-Customizable Layout**: Create and customize your own dashboard layout
- **Grid-Based System**: 12-column responsive grid structure
- **Widget Management**: Add, remove, move, and resize widgets
- **Collision Prevention**: Automatic prevention of overlapping widgets
- **Real-Time Updates**: Layout changes reflected immediately

### 2. Drag-and-Drop & Resizing
- Drag-and-drop widget positioning
- Resizable widgets with min/max constraints
- Automatic layout reflow
- Smart grid alignment
- Lock/unlock widgets to prevent movement

### 3. Widget Catalog
Available widget types:
- **Bar Chart**: Visualize data with bar graphs
- **Line Chart**: Track trends over time
- **Pie Chart**: Show proportional data
- **KPI Cards**: Display key performance indicators
- **Tables**: Show tabular data
- **Metrics Summary**: Display multiple metrics

### 4. Widget Configuration
Each widget supports:
- Graph type selection (standard, stacked, grouped)
- Date range filters (7/30/90 days, this year)
- Category filtering (sales, marketing, operations)
- Data source selection
- Refresh interval (manual, 30s, 1min, 5min)

### 5. Widget Actions
- **Add Widget**: Create new widgets from catalog
- **Remove Widget**: Delete widgets from dashboard
- **Edit Configuration**: Modify widget settings
- **Duplicate Widget**: Clone existing widgets
- **Lock/Unlock**: Prevent/allow widget movement
- **Refresh**: Manually refresh widget data

### 6. Data States
Widgets support multiple states:
- Loading state with spinner
- Error state with error message
- No data state
- Permission denied state
- Ready state with data

### 7. User-Specific Persistence
- Dashboard configurations saved per user in localStorage
- Auto-load saved layout on page reload
- Manual save option available

### 8. Templates
- **Default Dashboard**: Pre-configured layout for new users
- **Sales Dashboard**: Optimized for sales metrics
- **Analytics Dashboard**: Focused on analytics data
- **Custom Templates**: Save current layout as template
- **Template Management**: Load any saved template

### 9. Responsive Design
- Fully responsive across desktop, tablet, and mobile
- Breakpoints: lg (1200px), md (996px), sm (768px), xs (480px), xxs (0px)
- Automatic layout adjustment per device size

### 10. Grid Constraints
- 12-column layout system
- Predefined widget sizes:
  - Small: 3 columns × 5 rows
  - Medium: 6 columns × 11 rows
  - Large: 9 columns × 17 rows
  - Default: 4 columns × 8 rows
- Snap-to-grid behavior enforced
- No manual pixel-based placement

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usage

### Adding a Widget
1. Click "Add Widget" button in toolbar
2. Enter widget name
3. Select widget type
4. Choose size
5. Click "Add Widget"

### Configuring a Widget
1. Click the settings icon on widget header
2. Select "Configure" from menu
3. Adjust settings (graph type, filters, data source, etc.)
4. Click "Save"

### Widget Actions
- **Duplicate**: Click settings → Duplicate
- **Lock/Unlock**: Click settings → Lock/Unlock
- **Refresh**: Click settings → Refresh
- **Remove**: Click X icon on widget header
- **Resize**: Use size dropdown in widget header
- **Move**: Drag widget by header (if unlocked)

### Templates
1. Click "Templates" in toolbar
2. Select a template to load
3. Or save current layout as new template

### Saving Layout
- Auto-saves every 800ms during changes
- Manual save via "Save Layout" button

## Technology Stack

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Material-UI**: Component library
- **react-grid-layout**: Grid system
- **Vite**: Build tool
- **lodash**: Utility functions

## Project Structure

```
src/
├── widgets/
│   ├── index.tsx              # Widget components
│   ├── WidgetContent.tsx      # Widget content renderer
│   └── WidgetConfigModal.tsx  # Configuration modal
├── utils/
│   └── templates.ts           # Template management
├── types.ts                   # TypeScript definitions
├── Dashboard.tsx              # Main dashboard component
├── DashboardLayout.tsx        # Layout manager
├── Toolbar.tsx                # Top toolbar
├── AddWidgetModal.tsx         # Add widget dialog
└── App.tsx                    # Root component
```

## Configuration

### Widget Size Dimensions
Modify in `DashboardLayout.tsx`:
```typescript
const getSizeDimensions = (size: string) => {
  const map: Record<string, { w: number; h: number }> = {
    small:   { w: 3,  h: 5  },
    medium:  { w: 6,  h: 11 },
    large:   { w: 9,  h: 17 },
    default: { w: 4,  h: 8  },
  };
  return map[size?.toLowerCase()] || map.default;
};
```

### Grid Breakpoints
Modify in `Dashboard.tsx`:
```typescript
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 };
```

## License

MIT
