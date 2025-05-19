import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Divider,
  Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Overlay from '../common/Overlay';

const PropertiesPanel = styled(Paper)({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '300px',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 11,
  fontFamily: 'Manrope, sans-serif',
});

const Header = styled(Box)({
  padding: '16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
});

const Content = styled(Box)({
  padding: '16px',
  flex: 1,
  overflowY: 'auto',
  '& .MuiFormControl-root': {
    marginBottom: '16px',
  },
});

const StyledTextarea = styled(TextareaAutosize)({
  width: '100%',
  minHeight: '120px',
  padding: '8px',
  fontFamily: 'monospace',
  fontSize: '12px',
  border: '1px solid rgba(0, 0, 0, 0.23)',
  borderRadius: '4px',
  marginBottom: '16px',
  '&:focus': {
    outline: 'none',
    borderColor: '#0F5EAA',
  },
});

const Section = styled(Box)({
  marginBottom: '24px',
});

const SectionTitle = styled(Typography)({
  fontWeight: 500,
  marginBottom: '12px',
});

interface NodePropertiesProps {
  node: any;
  onClose: () => void;
  onNodeUpdate: (nodeId: string, data: any) => void;
  onNodeDelete?: (nodeId: string) => void;
  nodes: any[];
  edges: any[];
}

const NodeProperties: React.FC<NodePropertiesProps> = ({
  node,
  onClose,
  onNodeUpdate,
  onNodeDelete,
  nodes,
  edges,
}) => {
  const [name, setName] = useState(node.data.label || '');
  const [policy, setPolicy] = useState(
    JSON.stringify(node.data.policy || {}, null, 2)
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    onNodeUpdate(node.id, {
      ...node.data,
      label: newName,
    });
  };

  const handlePolicyChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newPolicy = event.target.value;
    setPolicy(newPolicy);
    try {
      const parsedPolicy = JSON.parse(newPolicy);
      onNodeUpdate(node.id, {
        ...node.data,
        policy: parsedPolicy,
      });
    } catch (error) {
      // Invalid JSON, don't update
    }
  };

  return (
    <>
      <Overlay show={true} onClick={onClose} />
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <PropertiesPanel elevation={4}>
          <Header>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Node Properties
            </Typography>
            <Box>
              {onNodeDelete && (
                <IconButton
                  onClick={() => onNodeDelete(node.id)}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Header>
          <Content>
            <Section>
              <SectionTitle variant="subtitle2">Basic Information</SectionTitle>
              <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                fullWidth
                size="small"
              />
            </Section>

            <Section>
              <SectionTitle variant="subtitle2">Node Type</SectionTitle>
              <Typography variant="body2" color="textSecondary">
                {node.data.block?.category || 'Unknown'}
              </Typography>
            </Section>

            <Section>
              <SectionTitle variant="subtitle2">Description</SectionTitle>
              <Typography variant="body2" color="textSecondary">
                {node.data.block?.description || 'No description available'}
              </Typography>
            </Section>

            <Section>
              <SectionTitle variant="subtitle2">
                Policy Configuration
              </SectionTitle>
              <StyledTextarea
                value={policy}
                onChange={handlePolicyChange}
                placeholder="Enter JSON configuration..."
              />
            </Section>
          </Content>
        </PropertiesPanel>
      </Slide>
    </>
  );
};

export default NodeProperties;
