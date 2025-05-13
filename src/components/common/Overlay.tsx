import React from 'react';
import { styled } from '@mui/material/styles';
import { Fade } from '@mui/material';

const OverlayBackground = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 10,
  backdropFilter: 'blur(2px)',
});

interface OverlayProps {
  show: boolean;
  onClick?: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ show, onClick }) => {
  return (
    <Fade in={show}>
      <OverlayBackground onClick={onClick} />
    </Fade>
  );
};

export default Overlay;
