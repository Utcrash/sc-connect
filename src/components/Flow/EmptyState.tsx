import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const EmptyStateContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 5,
  textAlign: 'center',
});

const StyledPaper = styled(Paper)({
  padding: '32px 48px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  fontFamily: 'Manrope, sans-serif',
});

const IconWrapper = styled(Box)({
  backgroundColor: '#0F5EAA',
  borderRadius: '50%',
  padding: '16px',
  marginBottom: '8px',
  '& svg': {
    fontSize: '32px',
    color: '#ffffff',
  },
});

const StyledTypography = styled(Typography)({
  fontFamily: 'Manrope, sans-serif',
});

const EmptyState: React.FC = () => {
  return (
    <EmptyStateContainer>
      <StyledPaper>
        <IconWrapper>
          <ChatIcon />
        </IconWrapper>
        <StyledTypography
          variant="h5"
          color="primary"
          gutterBottom
          sx={{
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Get Started
        </StyledTypography>
        <StyledTypography
          variant="body1"
          color="textSecondary"
          sx={{
            maxWidth: '400px',
            fontWeight: 400,
          }}
        >
          Use the chat panel on the right to describe your flow. Try something
          like:
        </StyledTypography>
        <Typography
          variant="body1"
          sx={{
            backgroundColor: '#f5f5f5',
            padding: '8px 16px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            color: '#0F5EAA',
            fontWeight: 500,
          }}
        >
          {'Create Vault -> Movement Block -> Success Block'}
        </Typography>
      </StyledPaper>
    </EmptyStateContainer>
  );
};

export default EmptyState;
