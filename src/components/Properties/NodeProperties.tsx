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
  const [policyJson, setPolicyJson] = useState(() => {
    try {
      return JSON.stringify(
        node.data?.block?.block_policy_template
          ? JSON.parse(node.data.block.block_policy_template)
          : {},
        null,
        2
      );
    } catch (e) {
      return '{}';
    }
  });
  const [mapperJson, setMapperJson] = useState('{}');

  if (!node) return null;

  // Get current source and target nodes
  const sourceNodes = edges
    .filter((edge) => edge.target === node.id)
    .map((edge) => edge.source);

  const targetNodes = edges
    .filter((edge) => edge.source === node.id)
    .map((edge) => edge.target);

  // Get available nodes for source/target selection (excluding current node)
  const availableNodes = nodes.filter((n) => n.id !== node.id);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNodeUpdate(node.id, { ...node.data, label: event.target.value });
  };

  const handleSourceChange = (event: any) => {
    const newSourceIds = event.target.value;
    onNodeUpdate(node.id, {
      ...node.data,
      sourceNodes: newSourceIds,
      connections: {
        ...node.data.connections,
        sources: newSourceIds,
        targets: targetNodes,
      },
    });
  };

  const handleTargetChange = (event: any) => {
    const newTargetIds = event.target.value;
    onNodeUpdate(node.id, {
      ...node.data,
      targetNodes: newTargetIds,
      connections: {
        ...node.data.connections,
        sources: sourceNodes,
        targets: newTargetIds,
      },
    });
  };

  const handlePolicyChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPolicyJson(event.target.value);
    try {
      const parsed = JSON.parse(event.target.value);
      onNodeUpdate(node.id, {
        ...node.data,
        policy: parsed,
      });
    } catch (e) {
      // Invalid JSON, don't update
    }
  };

  const handleMapperChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMapperJson(event.target.value);
    try {
      const parsed = JSON.parse(event.target.value);
      onNodeUpdate(node.id, {
        ...node.data,
        mapper: parsed,
      });
    } catch (e) {
      // Invalid JSON, don't update
    }
  };

  const handleDelete = () => {
    if (onNodeDelete && node) {
      onNodeDelete(node.id);
      onClose();
    }
  };

  return (
    <>
      <Overlay show={!!node} onClick={onClose} />
      <Slide direction="right" in={!!node} mountOnEnter unmountOnExit>
        <PropertiesPanel elevation={4}>
          <Header>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Node Properties
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={handleDelete}
                size="small"
                sx={{ color: '#d32f2f' }}
                title="Delete node"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Header>
          <Content>
            <Section>
              <TextField
                fullWidth
                label="Node Name"
                value={node.data?.label || ''}
                onChange={handleNameChange}
              />
            </Section>

            <Section>
              <FormControl fullWidth>
                <InputLabel>Source Nodes</InputLabel>
                <Select
                  multiple
                  value={sourceNodes}
                  onChange={handleSourceChange}
                  label="Source Nodes"
                >
                  {availableNodes.map((n) => (
                    <MenuItem key={n.id} value={n.id}>
                      {n.data?.label || n.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Target Nodes</InputLabel>
                <Select
                  multiple
                  value={targetNodes}
                  onChange={handleTargetChange}
                  label="Target Nodes"
                >
                  {availableNodes.map((n) => (
                    <MenuItem key={n.id} value={n.id}>
                      {n.data?.label || n.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Section>

            <Divider sx={{ my: 2 }} />

            <Section>
              <SectionTitle variant="subtitle2">
                Policy Configuration
              </SectionTitle>
              <StyledTextarea
                value={policyJson}
                onChange={handlePolicyChange}
                placeholder="Enter policy configuration in JSON format"
              />
            </Section>

            <Section>
              <SectionTitle variant="subtitle2">Data Mapper</SectionTitle>
              <StyledTextarea
                value={mapperJson}
                onChange={handleMapperChange}
                placeholder="Enter data mapping configuration in JSON format"
              />
            </Section>
          </Content>
        </PropertiesPanel>
      </Slide>
    </>
  );
};

export default NodeProperties;
