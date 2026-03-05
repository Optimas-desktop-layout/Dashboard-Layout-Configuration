export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetConfig {
  graphType?: string;
  dateRange?: string;
  category?: string;
  dataSource?: string;
  refreshInterval?: number;
  filters?: Record<string, any>;
}

export interface Widget {
  id: number;
  name: string;
  component: string;
  size: string;
  position: WidgetPosition;
  config?: WidgetConfig;
  locked?: boolean;
  state?: 'loading' | 'error' | 'nodata' | 'denied' | 'ready';
}

export interface WidgetData {
  name: string;
  component: string;
  size: string;
  config?: WidgetConfig;
}

export type WidgetType = 'BarChart' | 'LineChart' | 'PieChart' | 'KPI' | 'Table' | 'Metrics';

export interface DashboardTemplate {
  id: string;
  name: string;
  widgets: Widget[];
  isDefault?: boolean;
}
