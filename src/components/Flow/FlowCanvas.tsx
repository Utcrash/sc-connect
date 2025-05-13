import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  XYPosition,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { styled } from '@mui/material/styles';
import BlocksPanel from '../BlocksPanel/BlocksPanel';
import EmptyState from './EmptyState';
import { Box } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CallSplitIcon from '@mui/icons-material/CallSplit';

const FlowContainer = styled('div')({
  width: '100%',
  height: '100%',
  background: '#F5F6F8',
  '& .react-flow__node.selected': {
    boxShadow: '0 0 0 0.7px rgb(15, 94, 170)',
  },
  '& .react-flow__node': {
    width: '80px !important',
  },
  '& .react-flow__edge-path': {
    stroke: '#0F5EAA',
    strokeWidth: 2,
  },
  '& .category-icon': {
    color: '#0F5EAA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '4px',
    '& svg': {
      fontSize: '12px',
    },
  },
});

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'anticipation':
      return <AccountBalanceIcon />;
    case 'party':
      return <StorageIcon />;
    case 'vault':
      return <StorageIcon />;
    case 'payment':
      return <PaymentIcon />;
    case 'recon':
      return <CompareArrowsIcon />;
    case 'transaction':
      return <SwapHorizIcon />;
    case 'flow control':
      return <CallSplitIcon />;
    default:
      return <SettingsIcon />;
  }
};

const CustomNode = ({ data }: { data: any }) => {
  return (
    <div style={{ maxWidth: '80px', overflow: 'hidden' }}>
      <Handle type="target" position={Position.Left} style={{ left: '-8px' }} />
      <div
        style={{
          display: 'flex',
        }}
      >
        <span className="category-icon">
          {getCategoryIcon(data.block?.category)}
        </span>
        <span
          style={{
            fontSize: '8px',
            display: 'flex',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {data.label}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ right: '-8px' }}
      />
    </div>
  );
};

interface Block {
  block_name: string;
  category: string;
  description: string;
  block_policy_template: string;
}

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (node: Node) => void;
  onNodeChange: (node: Node) => void;
  onNodeSelect: (node: Node) => void;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const nodeTypes = {
  default: CustomNode,
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

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodeClick,
  onNodeChange,
  onNodeSelect,
  setEdges,
}) => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    // Fetch blocks data
    // TODO: Replace with actual API call
    const mockBlocks: Block[] = [
      {
        block_name: 'HTTP Request',
        category: 'Integration',
        description: 'Make HTTP requests to external services',
        block_policy_template: '{"method": "GET", "url": "", "headers": {}}',
      },
      {
        block_name: 'Data Transform',
        category: 'Processing',
        description: 'Transform data between formats',
        block_policy_template: '{"mappings": {}}',
      },
      // Add more mock blocks as needed
    ];
    setBlocks(mockBlocks);
  }, []);

  const handleAddBlock = useCallback(
    (block: Block) => {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'default',
        position: { x: 100, y: 100 }, // You might want to calculate a better position
        data: {
          label: block.block_name,
          category: block.category,
          description: block.description,
          policies: block.block_policy_template,
        },
      };

      if (onNodeChange) {
        onNodeChange(newNode);
      }
    },
    [onNodeChange]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = changes.reduce((acc, change) => {
        if (change.type === 'position' && change.dragging) {
          return acc;
        }
        return applyNodeChanges([change], acc);
      }, nodes);

      if (onNodeChange && changes.length > 0) {
        const change = changes[0];
        if ('id' in change) {
          const changedNode = updatedNodes.find(
            (node) => node.id === change.id
          );
          if (changedNode) {
            onNodeChange(changedNode);
          }
        }
      }
    },
    [nodes, onNodeChange]
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Helper function to check if adding an edge would create a cycle
  const wouldCreateCycle = (source: string, target: string): boolean => {
    // Create a map of node connections
    const connections = new Map<string, Set<string>>();
    edges.forEach((edge) => {
      if (!connections.has(edge.source)) {
        connections.set(edge.source, new Set());
      }
      connections.get(edge.source)?.add(edge.target);
    });

    // Add the potential new connection
    if (!connections.has(source)) {
      connections.set(source, new Set());
    }
    connections.get(source)?.add(target);

    // Check for cycles using DFS
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (node: string): boolean => {
      if (!visited.has(node)) {
        visited.add(node);
        recursionStack.add(node);

        const neighbors = connections.get(node) || new Set();
        for (const neighbor of Array.from(neighbors)) {
          if (!visited.has(neighbor) && hasCycle(neighbor)) {
            return true;
          } else if (recursionStack.has(neighbor)) {
            return true;
          }
        }
      }
      recursionStack.delete(node);
      return false;
    };

    return hasCycle(source);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // Prevent self-loops
        if (params.source === params.target) {
          return;
        }

        if (!wouldCreateCycle(params.source, params.target)) {
          const newEdge = createEdge(params.source, params.target);
          setEdges((eds: Edge[]) => [...eds, newEdge]);
        }
      }
    },
    [setEdges]
  );

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    onNodeClick(node);
    onNodeSelect(node);
  };

  return (
    <FlowContainer>
      {nodes.length === 0 && <EmptyState />}
      {/* <BlocksPanel blocks={blocks} onAddBlock={handleAddBlock} /> */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        nodesDraggable={false}
        defaultEdgeOptions={{
          type: 'default',
          animated: false,
          style: { stroke: '#0F5EAA' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#0F5EAA' },
        }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </FlowContainer>
  );
};

export default FlowCanvas;
