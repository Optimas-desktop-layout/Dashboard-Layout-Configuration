import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import { WidgetData } from './types';

interface AddWidgetModalProps {
  onClose: () => void;
  onAdd: (widget: WidgetData) => void;
}

const AddWidgetModal = ({ onClose, onAdd }: AddWidgetModalProps) => {
  const [name, setName] = useState('');
  const [component, setComponent] = useState('BarChart');
  const [size, setSize] = useState('medium');

  const buttonStyle = {
    '&:focus': { outline: 'none' },
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, component, size });
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Widget</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Widget Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={component}
                label="Type"
                onChange={(e) => setComponent(e.target.value)}
              >
                <MenuItem value="BarChart">Bar Chart</MenuItem>
                <MenuItem value="LineChart">Line Chart</MenuItem>
                <MenuItem value="PieChart">Pie Chart</MenuItem>
                <MenuItem value="KPI">KPI Card</MenuItem>
                <MenuItem value="Table">Table</MenuItem>
                <MenuItem value="Metrics">Metrics Summary</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                value={size}
                label="Size"
                onChange={(e) => setSize(e.target.value)}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={buttonStyle}>Cancel</Button>
          <Button type="submit" variant="contained" sx={buttonStyle}>Add Widget</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddWidgetModal;
