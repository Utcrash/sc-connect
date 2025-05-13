import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';

const BlocksPanelContainer = styled(Paper)({
  position: 'absolute',
  left: '16px',
  top: '80px',
  width: '300px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 96px)', // 80px top + 16px bottom
});

const Header = styled(Box)({
  padding: '12px 16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
});

const FiltersContainer = styled(Box)({
  padding: '12px 16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
});

const BlocksList = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '8px',
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

const BlockCard = styled(Card)({
  marginBottom: '8px',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

const BlockHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const CategoryChip = styled(Typography)({
  color: '#666',
  fontSize: '12px',
});

interface Block {
  block_name: string;
  category: string;
  description: string;
  block_policy_template: string;
}

interface BlocksPanelProps {
  blocks: Block[];
  onAddBlock: (block: Block) => void;
}

const BlocksPanel: React.FC<BlocksPanelProps> = ({ blocks, onAddBlock }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = Array.from(new Set(blocks.map((block) => block.category)));

  const filteredBlocks = blocks.filter((block) => {
    const matchesCategory =
      !selectedCategory || block.category === selectedCategory;
    const matchesSearch = block.block_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <BlocksPanelContainer>
      <Header>
        <Typography variant="h6">Blocks</Typography>
      </Header>

      <FiltersContainer>
        <FormControl fullWidth size="small" sx={{ mb: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          size="small"
          placeholder="Search blocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FiltersContainer>

      <BlocksList>
        {filteredBlocks.map((block) => (
          <BlockCard key={block.block_name} variant="outlined">
            <CardContent>
              <BlockHeader>
                <Box>
                  <Typography variant="subtitle2">
                    {block.block_name}
                  </Typography>
                  <CategoryChip variant="caption">
                    {block.category}
                  </CategoryChip>
                </Box>
                <Box>
                  <Tooltip title={block.description} placement="left">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={() => onAddBlock(block)}
                    sx={{ ml: 1 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </BlockHeader>
            </CardContent>
          </BlockCard>
        ))}
      </BlocksList>
    </BlocksPanelContainer>
  );
};

export default BlocksPanel;
