'use client';

import { useState } from 'react';
import { styled, Box, useTheme, Theme } from '@mui/system';
import { Modal } from '@mui/base/Modal';

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme: Theme) => ({
  width: '67.5vh',
  height: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  pt: 2,
  px: 4,
  pb: 3,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#181425',
  backgroundPosition: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '90vw',
    height: '120vw',
    backgroundSize: 'cover',
    '& .title-header': {
      fontSize: '24px',
      top: '-28px',
    },
    '& .box-table': {
      marginTop: '18px',
    },
    '& p.MuiTypography-body2': {
      width: '100%',
      marginTop: '4px',
    },
  },
});
interface ModalProps {
  ModalIcon: JSX.Element;
  child: JSX.Element;
  flag?: string;
}
const CustomModal = (props: ModalProps): JSX.Element | null => {
  const { ModalIcon, child, flag } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  return (
    <>
      <div onClick={handleOpen}>{ModalIcon}</div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
      >
        <>
          <Backdrop />
          <Box
            sx={{
              ...style(theme),
              backgroundImage: `url(${
                flag === 'score'
                  ? '/images/leaderboards/wen_game.png'
                  : flag === 'burnings'
                    ? '/images/leaderboards/mt_gawx.png'
                    : '/images/leaderboards/nifty_smashers.jpg'
              })`,
            }}
          >
            {child}
          </Box>
        </>
      </StyledModal>
    </>
  );
};
export default CustomModal;
