import { useState } from 'react';
import { AppBar, Toolbar as MuiToolbar, Button, Box, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import TemplateIcon from '@mui/icons-material/Dashboard';
import ClearIcon from '@mui/icons-material/Clear';
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

const Toolbar = ({ onAddWidget, onSave, onLoadTemplate, onSaveAsTemplate, onClearDashboard, onDeleteTemplate, showSaveButton, showClearButton, editMode, onToggleMode }: ToolbarProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [templateAnchor, setTemplateAnchor] = useState<null | HTMLElement>(null);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templates, setTemplates] = useState(getAllTemplates());

  const buttonStyle = {
    '&:focus': { outline: 'none' },
    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
  };

  const dialogButtonStyle = {
    '&:focus': { outline: 'none' },
    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
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

  return (
    <>
      <AppBar position="static">
        <MuiToolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
            {editMode && (
              <>
                <Button
                  color="inherit"
                  startIcon={<AddIcon />}
                  onClick={() => setModalOpen(true)}
                  sx={buttonStyle}
                >
                  Add Widget
                </Button>
                {showSaveButton && (
                  <Button
                    color="inherit"
                    startIcon={<SaveIcon />}
                    onClick={onSave}
                    sx={buttonStyle}
                  >
                    Save Layout
                  </Button>
                )}
                <Button
                  color="inherit"
                  startIcon={<TemplateIcon />}
                  onClick={handleTemplateMenuOpen}
                  sx={buttonStyle}
                >
                  Templates
                </Button>
                {showClearButton && (
                  <Button
                    color="inherit"
                    startIcon={<ClearIcon />}
                    onClick={onClearDashboard}
                    sx={buttonStyle}
                  >
                    Clear Dashboard
                  </Button>
                )}
              </>
            )}
            {!editMode && (
              <Button
                color="inherit"
                startIcon={<TemplateIcon />}
                onClick={handleTemplateMenuOpen}
                sx={buttonStyle}
              >
                Templates
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              color="inherit"
              onClick={onToggleMode}
              startIcon={editMode ? <VisibilityIcon /> : <EditIcon /> }
              sx={buttonStyle}
            >
              {editMode ?  'View Mode' : 'Edit Mode'}
            </Button>
          </Box>
        </MuiToolbar>
      </AppBar>

      <Menu
        anchorEl={templateAnchor}
        open={Boolean(templateAnchor)}
        onClose={() => setTemplateAnchor(null)}
      >
        {templates.map(template => (
          <MenuItem
            key={template.id}
            onClick={() => {
              onLoadTemplate(template.id);
              setTemplateAnchor(null);
            }}
            sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 250 }}
          >
            <ListItemText>{template.name}</ListItemText>
            {!template.isDefault && (
              <IconButton
                size="small"
                onClick={(e) => handleDeleteTemplate(template.id, e)}
                sx={{ ml: 2 }}
              >
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
        <AddWidgetModal
          onClose={() => setModalOpen(false)}
          onAdd={onAddWidget}
        />
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
          <Button onClick={() => setSaveTemplateOpen(false)} sx={dialogButtonStyle}>Cancel</Button>
          <Button onClick={handleSaveTemplate} variant="contained" sx={dialogButtonStyle}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Toolbar;
