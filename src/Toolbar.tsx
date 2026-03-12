 import { useState } from 'react';
import {
  Box, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, ListItemIcon, ListItemText,
  Divider, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import TemplateIcon from '@mui/icons-material/Dashboard';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddWidgetModal from './AddWidgetModal';
import { WidgetData } from './types';
import { getAllTemplates } from './utils/templates';

interface ToolbarProps {
  onAddWidget: (widget: WidgetData) => void;
  onSave: () => void;
  onLoadTemplate: (templateId: string) => void;
  onSaveAsTemplate: (name: string) => void;
  onClearDashboard: () => void;
  onDeleteTemplate: (templateId: string) => void;
  showSaveButton: boolean;
  showClearButton: boolean;
  editMode: boolean;
  onToggleMode: () => void;
}

const Toolbar = ({
  onAddWidget, onSave, onLoadTemplate, onSaveAsTemplate,
  onClearDashboard, onDeleteTemplate, showSaveButton,
  showClearButton, editMode, onToggleMode
}: ToolbarProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [templateAnchor, setTemplateAnchor] = useState<null | HTMLElement>(null);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false); // NEW
  const [templateName, setTemplateName] = useState('');
  const [templates, setTemplates] = useState(getAllTemplates());

  const btnStyle = {
    textTransform: 'none',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#ffffff',
    px: 1.5,
    py: 0.6,
    borderRadius: '6px',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#ffffff' },
    '&:focus': { outline: 'none' },
  };

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveAsTemplate(templateName);
      setTemplateName('');
      setSaveTemplateOpen(false);
      setTemplates(getAllTemplates());
    }
  };

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteTemplate(templateId);
    setTemplates(getAllTemplates());
  };

  const handleTemplateMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setTemplateAnchor(e.currentTarget);
    setTemplates(getAllTemplates());
  };

  const handleConfirmClear = () => {
    onClearDashboard();
    setConfirmClearOpen(false);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '8px',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          backgroundColor: '#1976d2'
        }}
      >
        <Button
          size="small"
          startIcon={editMode ? <VisibilityIcon fontSize="small" /> : <EditIcon fontSize="small" />}
          onClick={onToggleMode}
          sx={btnStyle}
        >
          {editMode ? 'View Layout' : 'Edit Mode'}
        </Button>

        <Button
          size="small"
          startIcon={<TemplateIcon fontSize="small" />}
          onClick={handleTemplateMenuOpen}
          sx={btnStyle}
        >
          Templates
        </Button>

        {editMode && showSaveButton && (
          <Button
            size="small"
            startIcon={<SaveIcon fontSize="small" />}
            onClick={onSave}
            sx={btnStyle}
          >
            Save Layout
          </Button>
        )}

        {editMode && (
          <IconButton
            size="small"
            onClick={() => setModalOpen(true)}
            sx={{
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              px: 1,
              color: '#ffffff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#ffffff' },
              '&:focus': { outline: 'none' },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        )}

        {editMode && showClearButton && (
          <IconButton
            size="small"
            onClick={() => setConfirmClearOpen(true)}
            sx={{
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              px: 1,
              color: '#ffffff',
              '&:focus': { outline: 'none' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      <Menu
        anchorEl={templateAnchor}
        open={Boolean(templateAnchor)}
        onClose={() => setTemplateAnchor(null)}
      >
        {templates.map(template => (
          <MenuItem
            key={template.id}
            onClick={() => { onLoadTemplate(template.id); setTemplateAnchor(null); }}
            sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 250 }}
          >
            <ListItemText>{template.name}</ListItemText>
            {!template.isDefault && (
              <IconButton size="small" onClick={(e) => handleDeleteTemplate(template.id, e)} sx={{ ml: 2 }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => { setSaveTemplateOpen(true); setTemplateAnchor(null); }}>
          <ListItemIcon><SaveIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Save Current as Template</ListItemText>
        </MenuItem>
      </Menu>

      {modalOpen && (
        <AddWidgetModal onClose={() => setModalOpen(false)} onAdd={onAddWidget} />
      )}

      <Dialog open={saveTemplateOpen} onClose={() => setSaveTemplateOpen(false)}>
        <DialogTitle>Save as Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            fullWidth
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveTemplateOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveTemplate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmClearOpen} onClose={() => setConfirmClearOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>Clear Dashboard</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to clear the dashboard? This will remove all widgets and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmClearOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClear}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none' }}
          >
            Clear Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Toolbar;