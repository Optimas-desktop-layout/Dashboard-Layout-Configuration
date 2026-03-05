import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { BarChart, LineChart, PieChart, KPI, TableWidget, MetricsWidget } from './index';
import { Widget } from '../types';

interface WidgetContentProps {
  widget: Widget;
}

export const WidgetContent = ({ widget }: WidgetContentProps) => {
  if (widget.state === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (widget.state === 'error') {
    return <Alert severity="error">Failed to load data</Alert>;
  }

  if (widget.state === 'nodata') {
    return <Alert severity="info">No data available</Alert>;
  }

  if (widget.state === 'denied') {
    return <Alert severity="warning">Permission denied</Alert>;
  }

  const components: Record<string, React.ReactElement> = {
    BarChart: <BarChart config={widget.config} />,
    LineChart: <LineChart config={widget.config} />,
    PieChart: <PieChart config={widget.config} />,
    KPI: <KPI config={widget.config} />,
    Table: <TableWidget config={widget.config} />,
    Metrics: <MetricsWidget config={widget.config} />,
  };

  return components[widget.component] || <Typography>Unknown widget type</Typography>;
};
