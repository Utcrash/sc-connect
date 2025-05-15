import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Slide,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import Overlay from '../common/Overlay';

const Panel = styled(Paper)({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '300px',
  backgroundColor: '#ffffff',
  zIndex: 11,
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Manrope, sans-serif',
});

const Header = styled(Box)({
  padding: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Content = styled(Box)({
  flex: 1,
  overflowY: 'auto',
});

const StyledListItemButton = styled(ListItemButton)({
  '&:hover': {
    backgroundColor: 'rgba(15, 94, 170, 0.08)',
  },
});

const StyledListItem = styled(ListItem)({
  display: 'block',
  padding: '4px 8px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
});

interface Block {
  block_name: string;
  category: string;
  description: string;
  block_policy_template: string;
}

interface BlockSelectionPanelProps {
  open: boolean;
  onClose: () => void;
  blocks: Block[];
  onSelectBlock: (block: Block) => void;
}

const BlockSelectionPanel: React.FC<BlockSelectionPanelProps> = ({
  open,
  onClose,
  blocks,
  onSelectBlock,
}) => {
  // Group blocks by category
  const groupedBlocks = blocks.reduce((acc, block) => {
    const category = block.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(block);
    return acc;
  }, {} as Record<string, Block[]>);

  return (
    <>
      <Overlay show={open} onClick={onClose} />
      <Slide direction="right" in={open} mountOnEnter unmountOnExit>
        <Panel elevation={4}>
          <Header>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Select Block
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Header>
          <Content>
            {Object.entries(groupedBlocks).map(([category, categoryBlocks]) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    px: 2,
                    py: 1,
                    color: 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  {category}
                </Typography>
                <List dense>
                  {categoryBlocks.map((block) => (
                    <StyledListItem key={block.block_name}>
                      <StyledListItemButton
                        onClick={() => onSelectBlock(block)}
                      >
                        <ListItemText
                          primary={block.block_name}
                          secondary={block.description}
                          primaryTypographyProps={{
                            sx: { fontWeight: 500 },
                          }}
                        />
                      </StyledListItemButton>
                    </StyledListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Content>
        </Panel>
      </Slide>
    </>
  );
};

export default BlockSelectionPanel;
