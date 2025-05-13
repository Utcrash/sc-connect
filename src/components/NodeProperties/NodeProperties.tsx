import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Node } from 'reactflow';

const PropertiesContainer = styled(Paper)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: 0,
  border: '1px solid rgba(0, 0, 0, 0.12)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
});

const ScrollContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  paddingRight: '8px',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '2px',
  },
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
});

const PropertySection = styled(Box)({
  marginBottom: '16px',
});

const JsonEditor = styled(TextField)({
  fontFamily: 'monospace',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F8F9FA',
  },
});

interface NodePropertiesProps {
  node: Node | null;
  onClose: () => void;
  onNodeChange?: (node: Node) => void;
}

const formatJson = (value: string): string => {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

const NodeProperties: React.FC<NodePropertiesProps> = ({
  node,
  onClose,
  onNodeChange,
}) => {
  if (!node) {
    return null;
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onNodeChange && node) {
      const updatedNode = {
        ...node,
        data: {
          ...node.data,
          label: event.target.value,
        },
      };
      onNodeChange(updatedNode);
    }
  };

  const handlePoliciesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    try {
      JSON.parse(value);
      if (onNodeChange && node) {
        onNodeChange({
          ...node,
          data: { ...node.data, policies: value },
        });
      }
    } catch {
      // Invalid JSON, don't update
    }
  };

  return (
    <PropertiesContainer>
      <Header>
        <Typography variant="h6" color="primary">
          Node Properties
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Header>

      <Divider sx={{ mb: 2 }} />

      <ScrollContainer>
        <PropertySection>
          <Typography variant="subtitle2" gutterBottom>
            Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={node.data?.label || ''}
            onChange={handleNameChange}
            placeholder="Node name"
          />
        </PropertySection>

        <PropertySection>
          <Typography variant="subtitle2" gutterBottom>
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            value={node.data?.description || ''}
            onChange={() => {}}
            placeholder="Enter node description"
          />
        </PropertySection>

        <PropertySection>
          <Typography variant="subtitle2" gutterBottom>
            Success Path
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={node.data?.successPath || ''}
            onChange={() => {}}
            placeholder="Success path"
          />
        </PropertySection>

        <PropertySection>
          <Typography variant="subtitle2" gutterBottom>
            Error Path
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={node.data?.errorPath || ''}
            onChange={() => {}}
            placeholder="Error path"
          />
        </PropertySection>

        <PropertySection>
          <Typography variant="subtitle2" gutterBottom>
            Policies (JSON)
          </Typography>
          <JsonEditor
            fullWidth
            multiline
            rows={6}
            size="small"
            value={formatJson(node.data?.policies || '{}')}
            onChange={handlePoliciesChange}
            placeholder="Enter policies as JSON"
          />
        </PropertySection>

        <PropertySection>
          <Typography variant="subtitle2" gutterBottom>
            Mappings
          </Typography>
          <JsonEditor
            fullWidth
            multiline
            rows={6}
            size="small"
            value={formatJson(node.data?.mappings || '{}')}
            onChange={() => {}}
            placeholder="Enter mappings as JSON"
          />
        </PropertySection>
      </ScrollContainer>
    </PropertiesContainer>
  );
};

export default NodeProperties;
