import { Widget, DashboardTemplate } from '../types';

export const DEFAULT_DASHBOARD: Widget[] = [
  {
    id: 1,
    name: 'Revenue Overview',
    component: 'LineChart',
    size: 'large',
    position: { x: 0, y: 0, w: 9, h: 10 },
    config: { dateRange: 'last30days', category: 'sales' },
    state: 'ready'
  },
  {
    id: 2,
    name: 'Total Users',
    component: 'KPI',
    size: 'small',
    position: { x: 9, y: 0, w: 3, h: 5 },
    state: 'ready'
  },
  {
    id: 3,
    name: 'Conversion Rate',
    component: 'KPI',
    size: 'small',
    position: { x: 9, y: 5, w: 3, h: 5 },
    state: 'ready'
  },
  {
    id: 4,
    name: 'Sales by Region',
    component: 'PieChart',
    size: 'medium',
    position: { x: 0, y: 10, w: 6, h: 11 },
    config: { category: 'sales' },
    state: 'ready'
  },
  {
    id: 5,
    name: 'Key Metrics',
    component: 'Metrics',
    size: 'medium',
    position: { x: 6, y: 10, w: 6, h: 11 },
    state: 'ready'
  }
];

export const TEMPLATES: DashboardTemplate[] = [
  {
    id: 'default',
    name: 'Default Dashboard',
    widgets: DEFAULT_DASHBOARD,
    isDefault: true
  },
  {
    id: 'sales',
    name: 'Sales Dashboard',
    widgets: [
      {
        id: 1,
        name: 'Sales Trend',
        component: 'LineChart',
        size: 'large',
        position: { x: 0, y: 0, w: 8, h: 12 },
        config: { category: 'sales', dateRange: 'last90days' },
        state: 'ready'
      },
      {
        id: 2,
        name: 'Total Revenue',
        component: 'KPI',
        size: 'small',
        position: { x: 8, y: 0, w: 4, h: 6 },
        state: 'ready'
      },
      {
        id: 3,
        name: 'Top Products',
        component: 'Table',
        size: 'medium',
        position: { x: 8, y: 6, w: 4, h: 12 },
        state: 'ready'
      }
    ],
    isDefault: true
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    widgets: [
      {
        id: 1,
        name: 'User Growth',
        component: 'BarChart',
        size: 'medium',
        position: { x: 0, y: 0, w: 6, h: 11 },
        state: 'ready'
      },
      {
        id: 2,
        name: 'Traffic Sources',
        component: 'PieChart',
        size: 'medium',
        position: { x: 6, y: 0, w: 6, h: 11 },
        state: 'ready'
      },
      {
        id: 3,
        name: 'Performance Metrics',
        component: 'Metrics',
        size: 'large',
        position: { x: 0, y: 11, w: 12, h: 8 },
        state: 'ready'
      }
    ],
    isDefault: true
  }
];

export const saveTemplate = (name: string, widgets: Widget[]) => {
  const templates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
  const newTemplate: DashboardTemplate = {
    id: `custom_${Date.now()}`,
    name,
    widgets: widgets.map(w => ({ ...w, id: Date.now() + Math.random() })),
    isDefault: false
  };
  templates.push(newTemplate);
  localStorage.setItem('customTemplates', JSON.stringify(templates));
};

export const deleteTemplate = (templateId: string) => {
  const templates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
  const filtered = templates.filter((t: DashboardTemplate) => t.id !== templateId);
  localStorage.setItem('customTemplates', JSON.stringify(filtered));
};

export const loadCustomTemplates = (): DashboardTemplate[] => {
  return JSON.parse(localStorage.getItem('customTemplates') || '[]');
};

export const getAllTemplates = (): DashboardTemplate[] => {
  return [...TEMPLATES, ...loadCustomTemplates()];
};
