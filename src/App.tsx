import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import FlowCanvas from './components/Flow/FlowCanvas';
import NodeProperties from './components/Properties/NodeProperties';
import BlockSelectionPanel from './components/BlockSelection/BlockSelectionPanel';
import ChatPanel from './components/Chat/ChatPanel';
import LoginPage from './components/Auth/LoginPage';
import ExportModal from './components/Export/ExportModal';
import { Node, Edge, MarkerType } from 'reactflow';
import './App.css';
import AddIcon from '@mui/icons-material/Add';
import ExportIcon from '@mui/icons-material/FileDownload';
import { blocks } from './data/blocks';

const AppContainer = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const MainContainer = styled('div')({
  flex: 1,
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
});

const CanvasContainer = styled('div')({
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
});

const AddBlockButton = styled(Button)({
  position: 'absolute',
  bottom: '32px',
  right: '32px',
  borderRadius: '28px',
  padding: '12px 24px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  zIndex: 10,
  backgroundColor: '#0F5EAA',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#0D4E8F',
  },
});

const ExportButton = styled(Button)({
  position: 'absolute',
  bottom: '32px',
  right: '200px',
  borderRadius: '28px',
  padding: '12px 24px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  zIndex: 10,
  backgroundColor: '#0F5EAA',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#0D4E8F',
  },
});

const PropertiesPanel = styled(Box)<{ open: boolean }>(({ open }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '300px',
  height: '100%',
  transform: `translateX(${open ? '0' : '-100%'})`,
  transition: 'transform 0.3s ease',
  zIndex: 3,
  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#ffffff',
}));

const ChatPanelWrapper = styled(Box)({
  width: '300px',
  height: '100%',
  borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#ffffff',
  zIndex: 2,
});

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const TopBar = styled(AppBar)({
  backgroundColor: '#0F5EAA',
  color: '#ffffff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isBlockSelectionOpen, setIsBlockSelectionOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const savedFlow = localStorage.getItem('canvasFlow');
      if (savedFlow) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedFlow);
        setNodes(savedNodes);
        setEdges(savedEdges);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('canvasFlow', JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges, isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handleExport = (type: 'json' | 'db') => {
    const flowData = {
      nodes: nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          policy: node.data.policy || {},
          mapper: node.data.mapper || {},
        },
      })),
      edges,
    };
    console.log('Exporting flow as', type, ':', flowData);
    setIsExportModalOpen(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Helper function to get next vertical position for a node with same source
  const getNextVerticalPosition = (sourceNode: Node): number => {
    const sourceEdges = edges.filter((edge) => edge.source === sourceNode.id);
    const targetNodes = nodes.filter((node) =>
      sourceEdges.some((edge) => edge.target === node.id)
    );
    const existingYPositions = targetNodes.map((node) => node.position.y);
    const baseY = sourceNode.position.y;

    // Start with -100 offset for first branch, then increment by 100
    for (let i = -1; i <= targetNodes.length; i++) {
      const yPos = baseY + i * 100;
      if (!existingYPositions.includes(yPos)) {
        return yPos;
      }
    }
    return baseY; // Fallback
  };

  const createEdge = (sourceId: string, targetId: string): Edge => {
    return {
      id: `edge-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: 'default',
      animated: false,
      style: { stroke: '#0F5EAA' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#0F5EAA' },
    };
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const handleNodeChange = (updatedNode: Node) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
  };

  const handleNodeUpdate = (nodeId: string, data: any) => {
    // Handle source and target node changes
    const sourceNodes = data.sourceNodes || [];
    const targetNodes = data.targetNodes || [];
    const currentNode = nodes.find((n) => n.id === nodeId);

    if (!currentNode) return;

    // Remove all existing edges connected to this node
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );

    // Create new edges based on source connections
    const newSourceEdges = sourceNodes.map((sourceId: string) =>
      createEdge(sourceId, nodeId)
    );

    // Create new edges based on target connections
    const newTargetEdges = targetNodes.map((targetId: string) =>
      createEdge(nodeId, targetId)
    );

    // Add all new edges
    setEdges((edges) => [...edges, ...newSourceEdges, ...newTargetEdges]);

    // Update node position based on its primary source (first source node)
    if (sourceNodes.length > 0) {
      const primarySource = nodes.find((n) => n.id === sourceNodes[0]);
      if (primarySource) {
        const existingTargets = nodes.filter((n) =>
          edges.some((e) => e.source === primarySource.id && e.target === n.id)
        );
        const yPosition =
          primarySource.position.y + existingTargets.length * 100;

        setNodes((nodes) => {
          const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId) {
              const updatedNode = {
                ...node,
                position: {
                  x: primarySource.position.x + 200,
                  y: yPosition,
                },
                data: {
                  ...node.data,
                  ...data,
                  block: {
                    ...node.data.block,
                    block_name: data.label,
                  },
                },
              };
              // Update selectedNode if this is the one being edited
              if (selectedNode && selectedNode.id === nodeId) {
                setSelectedNode(updatedNode);
              }
              return updatedNode;
            }
            return node;
          });
          return updatedNodes;
        });
      }
    } else {
      // If no source nodes, just update the node data
      setNodes((nodes) => {
        const updatedNodes = nodes.map((node) => {
          if (node.id === nodeId) {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                ...data,
                block: {
                  ...node.data.block,
                  block_name: data.label,
                },
              },
            };
            // Update selectedNode if this is the one being edited
            if (selectedNode && selectedNode.id === nodeId) {
              setSelectedNode(updatedNode);
            }
            return updatedNode;
          }
          return node;
        });
        return updatedNodes;
      });
    }
  };

  const handleAddBlock = (block: any) => {
    const lastNode = nodes[nodes.length - 1];
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'default',
      position: {
        x: lastNode ? lastNode.position.x + 200 : 100,
        y: lastNode ? lastNode.position.y : 100,
      },
      data: {
        label: block.block_name,
        block: {
          ...block,
          block_name: block.block_name,
          category: block.category,
          description: block.description,
          block_policy_template: block.block_policy_template,
        },
        policy: block.block_policy_template
          ? JSON.parse(block.block_policy_template)
          : {},
        mapper: {},
      },
    };

    setNodes((nds) => [...nds, newNode]);

    if (lastNode) {
      const newEdge = createEdge(lastNode.id, newNode.id);
      setEdges((eds) => [...eds, newEdge]);
    }
  };

  const handleCreateFlow = (nodeNames: string[]) => {
    if (nodeNames[0].toLowerCase() === 'clear') {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Clear existing nodes and edges
    setNodes([]);
    setEdges([]);

    // Create nodes array to store all nodes
    const newNodes: Node[] = [];

    // Create nodes in a straight horizontal line
    nodeNames.forEach((name, index) => {
      const block =
        blocks.find((b) => b.block_name.toLowerCase() === name.toLowerCase()) ||
        blocks[0];

      newNodes.push({
        id: `node-${Date.now()}-${index}`,
        type: 'default',
        position: { x: 100 + index * 200, y: 100 },
        data: {
          label: name,
          block: {
            ...block,
            block_name: name,
            category: block.category,
            description: block.description,
            block_policy_template: block.block_policy_template,
          },
          policy: block.block_policy_template
            ? JSON.parse(block.block_policy_template)
            : {},
          mapper: {},
        },
      });
    });

    // Create edges between consecutive nodes
    const newEdges = newNodes
      .slice(1)
      .map((node, index) => createEdge(newNodes[index].id, node.id));

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleNodeDelete = (nodeId: string) => {
    // Remove all edges connected to this node
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );

    // Remove the node
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));

    // Clear selected node
    setSelectedNode(null);
  };

  return (
    <AppContainer>
      <TopBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SC Connect Flow Designer
          </Typography>
          <UserInfo>
            <Typography variant="body2">admin</Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#E32726' }}>
              A
            </Avatar>
            <Button
              color="inherit"
              size="small"
              onClick={handleLogout}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          </UserInfo>
        </Toolbar>
      </TopBar>

      <MainContainer>
        <CanvasContainer>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            onNodeChange={handleNodeChange}
            onNodeSelect={setSelectedNode}
            setEdges={setEdges}
          />
          <ExportButton
            variant="contained"
            onClick={() => setIsExportModalOpen(true)}
            startIcon={<ExportIcon />}
          >
            Export
          </ExportButton>
          <AddBlockButton
            variant="contained"
            onClick={() => setIsBlockSelectionOpen(true)}
            startIcon={<AddIcon />}
          >
            Add Block
          </AddBlockButton>
        </CanvasContainer>

        {selectedNode && (
          <NodeProperties
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onNodeUpdate={handleNodeUpdate}
            onNodeDelete={handleNodeDelete}
            nodes={nodes}
            edges={edges}
          />
        )}

        <BlockSelectionPanel
          open={isBlockSelectionOpen}
          onClose={() => setIsBlockSelectionOpen(false)}
          blocks={blocks}
          onSelectBlock={(block) => {
            handleAddBlock(block);
            setIsBlockSelectionOpen(false);
          }}
        />

        <ChatPanelWrapper>
          <ChatPanel onCreateFlow={handleCreateFlow} />
        </ChatPanelWrapper>
      </MainContainer>

      <ExportModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </AppContainer>
  );
};

export default App;
