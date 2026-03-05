import { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import { Snackbar, Alert, CssBaseline } from '@mui/material';
import Toolbar from './Toolbar';
import { Dashboard } from './Dashboard';
import { Widget, WidgetData, WidgetPosition, WidgetConfig } from './types';
import { DEFAULT_DASHBOARD, getAllTemplates, saveTemplate, deleteTemplate } from './utils/templates';
import { LAYOUT_CONSTRAINTS, clampWidgetSize } from './config/layoutConstraints';
import "./dashboard.css";

const DashboardLayout = () => {
  const [layout, setLayout] = useState<Widget[]>([]);
  const [savedLayout, setSavedLayout] = useState<string>('');
 const [editMode, setEditMode] = useState(() => {
  const saved = localStorage.getItem('editMode');
  return saved ? JSON.parse(saved) : false; 
});

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    localStorage.setItem('editMode', JSON.stringify(editMode));
  }, [editMode]);

  useEffect(() => {
    const saved = localStorage.getItem('dashboardLayout');
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
        setSavedLayout(saved);
      } catch (e) {
        console.error("Invalid layout in localStorage", e);
        setLayout(DEFAULT_DASHBOARD);
        setSavedLayout(JSON.stringify(DEFAULT_DASHBOARD));
      }
    } else {
      setLayout(DEFAULT_DASHBOARD);
      setSavedLayout(JSON.stringify(DEFAULT_DASHBOARD));
    }
  }, []);

  const throttledSave = throttle((newLayout: Widget[]) => {
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  }, 800);

  const saveLayout = (newLayout: Widget[]) => {
    setLayout(newLayout);
    throttledSave(newLayout);
  };

  const handleManualSave = () => {
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    setSavedLayout(JSON.stringify(layout));
    setToast({ open: true, message: 'Layout saved successfully!', severity: 'success' });
  };

  const handleClearDashboard = () => {
    setLayout([]);
    localStorage.setItem('dashboardLayout', JSON.stringify([]));
    setSavedLayout(JSON.stringify([]));
    setToast({ open: true, message: 'Dashboard cleared!', severity: 'info' });
  };

  const getSizeDimensions = (size: string) => {
    const dims = LAYOUT_CONSTRAINTS.WIDGET_SIZES[size?.toLowerCase() as keyof typeof LAYOUT_CONSTRAINTS.WIDGET_SIZES] 
    return clampWidgetSize(dims.w, dims.h);
  };

  const handleAddWidget = (widgetData: WidgetData) => {
    if (!widgetData.name?.trim() || !widgetData.component) return;
    const size = widgetData.size
    const dims = getSizeDimensions(size);

    const newItem: Widget = {
      id: Date.now(),
      name: widgetData.name.trim(),
      component: widgetData.component,
      size: size,
      position: { x: 0, y: 0, w: dims.w, h: dims.h },
      config: widgetData.config || {},
      locked: false,
      state: 'ready',
    };

    const newLayout = [...layout, newItem];
    const placed = placeSmartly(newLayout, newItem);
    saveLayout(placed);
    setToast({ open: true, message: 'Widget added successfully!', severity: 'success' });
  };

  const placeSmartly = (current: Widget[], newWidget: Widget): Widget[] => {
    const COLS = LAYOUT_CONSTRAINTS.TOTAL_COLUMNS;
    let bestX = 0;
    let bestY = Infinity;

    for (let y = 0; y < 200; y++) {
      for (let x = 0; x <= COLS - newWidget.position.w; x++) {
        const testPos = { ...newWidget.position, x, y };
        if (!overlapsAny(current, newWidget.id, testPos)) {
          if (y < bestY) {
            bestY = y;
            bestX = x;
          }
          break;
        }
      }
      if (bestY < Infinity) break;
    }

    if (bestY === Infinity) {
      bestY = Math.max(0, ...current.map(w => w.position.y + w.position.h)) || 0;
      bestX = 0;
    }

    const updated = current.map(item =>
      item.id === newWidget.id
        ? { ...item, position: { ...item.position, x: bestX, y: bestY } }
        : item
    );

    return compact(updated);
  };

  const overlapsAny = (items: Widget[], selfId: number, pos: WidgetPosition): boolean => {
    return items.some(item => {
      if (item.id === selfId) return false;
      const p = item.position;
      return !(
        pos.x + pos.w <= p.x ||
        p.x + p.w <= pos.x ||
        pos.y + pos.h <= p.y ||
        p.y + p.h <= pos.y
      );
    });
  };

  const compact = (items: Widget[]): Widget[] => {
    const sorted = [...items].sort((a, b) => {
      if (a.position.y !== b.position.y) return a.position.y - b.position.y;
      return a.position.x - b.position.x;
    });

    const result: Widget[] = [];

    for (const widget of sorted) {
      let bestY = 0;
      let bestX = 0;
      let found = false;

      outer: for (let y = 0; y < 100; y++) {
        for (let x = 0; x <= LAYOUT_CONSTRAINTS.TOTAL_COLUMNS - widget.position.w; x++) {
          const testPos = { ...widget.position, x, y };
          if (!overlapsAny(result, widget.id, testPos)) {
            bestX = x;
            bestY = y;
            found = true;
            break outer;
          }
        }
      }

      if (!found) {
        bestY = Math.max(...result.map(w => w.position.y + w.position.h), 0);
        bestX = 0;
      }

      result.push({
        ...widget,
        position: { ...widget.position, x: bestX, y: bestY }
      });
    }

    return result;
  };

  const removeWidget = (id: number) => {
    const filtered = layout.filter(w => w.id !== id);
    saveLayout(compact(filtered));
    setToast({ open: true, message: 'Widget removed!', severity: 'info' });
  };

  const updateWidgetSize = (id: number, newSize: string) => {
    const dims = getSizeDimensions(newSize);

    const updated = layout.map(w =>
      w.id === id
        ? { ...w, size: newSize.toLowerCase(), position: { ...w.position, w: dims.w, h: dims.h } }
        : w
    );

    const widget = updated.find(w => w.id === id);
    if (!widget) return;

    const others = updated.filter(w => w.id !== id);
    const rePlaced = placeSmartly([...others, widget], widget);

    saveLayout(rePlaced);
  };

  const duplicateWidget = (id: number) => {
    const widget = layout.find(w => w.id === id);
    if (!widget) return;

    const newWidget: Widget = {
      ...widget,
      id: Date.now(),
      name: `${widget.name} (Copy)`,
    };

    const newLayout = [...layout, newWidget];
    const placed = placeSmartly(newLayout, newWidget);
    saveLayout(placed);
    setToast({ open: true, message: 'Widget duplicated!', severity: 'success' });
  };

  const toggleLock = (id: number) => {
    const widget = layout.find(w => w.id === id);
    const updated = layout.map(w =>
      w.id === id ? { ...w, locked: !w.locked } : w
    );
    saveLayout(updated);
    setToast({ open: true, message: widget?.locked ? 'Widget unlocked!' : 'Widget locked!', severity: 'info' });
  };

  const refreshWidget = (id: number) => {
    const updated = layout.map(w =>
      w.id === id ? { ...w, state: 'loading' as const } : w
    );
    setLayout(updated);

    setTimeout(() => {
      const refreshed = layout.map(w =>
        w.id === id ? { ...w, state: 'ready' as const } : w
      );
      saveLayout(refreshed);
      setToast({ open: true, message: 'Widget refreshed!', severity: 'success' });
    }, 1000);
  };

  const configureWidget = (id: number, config: WidgetConfig) => {
    const updated = layout.map(w =>
      w.id === id ? { ...w, config } : w
    );
    saveLayout(updated);
    setToast({ open: true, message: 'Widget configured!', severity: 'success' });
  };

  const loadTemplate = (templateId: string) => {
    const template = getAllTemplates().find(t => t.id === templateId);
    if (template) {
      const newWidgets = template.widgets.map(w => ({
        ...w,
        id: Date.now() + Math.random(),
      }));
      saveLayout(newWidgets);
      setSavedLayout(JSON.stringify(newWidgets));
      setToast({ open: true, message: `Template "${template.name}" loaded!`, severity: 'success' });
    }
  };

  const saveAsTemplate = (name: string) => {
    saveTemplate(name, layout);
    setToast({ open: true, message: `Template "${name}" saved!`, severity: 'success' });
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    setToast({ open: true, message: 'Template deleted!', severity: 'info' });
  };

  const hasUnsavedChanges = JSON.stringify(layout) !== savedLayout;
  const hasWidgets = layout.length > 0;

  return (
    <>
      <CssBaseline />
      <div>
      <Toolbar 
        onAddWidget={handleAddWidget} 
        onSave={handleManualSave}
        onLoadTemplate={loadTemplate}
        onSaveAsTemplate={saveAsTemplate}
        onClearDashboard={handleClearDashboard}
        onDeleteTemplate={handleDeleteTemplate}
        showSaveButton={hasUnsavedChanges}
        showClearButton={hasWidgets}
        editMode={editMode}
        onToggleMode={() => setEditMode(!editMode)}
      />
      <Dashboard
        layout={layout}
        onLayoutChange={saveLayout}
        onRemoveWidget={removeWidget}
        onUpdateSize={updateWidgetSize}
        onDuplicateWidget={duplicateWidget}
        onToggleLock={toggleLock}
        onRefreshWidget={refreshWidget}
        onConfigureWidget={configureWidget}
        editMode={editMode}
      />
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
      </div>
    </>
  );
};

export default DashboardLayout;
