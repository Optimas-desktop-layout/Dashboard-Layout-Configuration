import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Button, FormControl, InputLabel, Box
} from '@mui/material';
import { WidgetConfig } from '../types';

interface WidgetConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: WidgetConfig) => void;
  initialConfig?: WidgetConfig;
  widgetType: string;
}

export const WidgetConfigModal = ({ open, onClose, onSave, initialConfig, widgetType }: WidgetConfigModalProps) => {
  const [config, setConfig] = useState<WidgetConfig>(initialConfig || {});

  const buttonStyle = {
    '&:focus': { outline: 'none' },
    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure Widget</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {['BarChart', 'LineChart', 'PieChart'].includes(widgetType) && (
              <FormControl fullWidth>
                <InputLabel>Graph Type</InputLabel>
                <Select
                  value={config.graphType || ''}
                  label="Graph Type"
                  onChange={(e) => setConfig({ ...config, graphType: e.target.value })}
                >
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="stacked">Stacked</MenuItem>
                  <MenuItem value="grouped">Grouped</MenuItem>
                </Select>
              </FormControl>
            )}
            
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={config.dateRange || 'last7days'}
                label="Date Range"
                onChange={(e) => setConfig({ ...config, dateRange: e.target.value })}
              >
                <MenuItem value="last7days">Last 7 days</MenuItem>
                <MenuItem value="last30days">Last 30 days</MenuItem>
                <MenuItem value="last90days">Last 90 days</MenuItem>
                <MenuItem value="thisyear">This year</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={config.category || 'all'}
                label="Category"
                onChange={(e) => setConfig({ ...config, category: e.target.value })}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="operations">Operations</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Data Source</InputLabel>
              <Select
                value={config.dataSource || 'default'}
                label="Data Source"
                onChange={(e) => setConfig({ ...config, dataSource: e.target.value })}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="database1">Database 1</MenuItem>
                <MenuItem value="database2">Database 2</MenuItem>
                <MenuItem value="api">External API</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Refresh Interval</InputLabel>
              <Select
                value={config.refreshInterval || 0}
                label="Refresh Interval"
                onChange={(e) => setConfig({ ...config, refreshInterval: Number(e.target.value) })}
              >
                <MenuItem value={0}>Manual</MenuItem>
                <MenuItem value={30}>30 seconds</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={300}>5 minutes</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={buttonStyle}>Cancel</Button>
          <Button type="submit" variant="contained" sx={buttonStyle}>Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
