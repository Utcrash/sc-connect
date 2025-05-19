import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (type: 'json' | 'db') => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  open,
  onClose,
  onExport,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Export Flow</DialogTitle>
      <DialogContent>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onExport('json')}>
              <ListItemText
                primary="Export as JSON"
                secondary="Download flow configuration as JSON file"
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onExport('db')}>
              <ListItemText
                primary="Export to Database"
                secondary="Save flow configuration to database"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
