'use client';

import { Container, Button, Typography } from '@mui/material';
import { GetApp } from '@mui/icons-material';
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog';
import useVersion from '@/hooks/useVersion';

export const Downloader = (): React.ReactNode => {
  const { isWindows, isMacOs, downloadURL, version, message } = useVersion();

  return (
    <Container style={{ textAlign: 'left', padding: '40px' }}>
      <Typography>
        Nifty League Desktop{' '}
        <span role="img" aria-label="joystick emoji">
          🕹️
        </span>
      </Typography>
      <p>The Nifty League Desktop is recommended for best performance and latest game updates.</p>
      <Typography>Setup Steps:</Typography>
      <ol style={{ lineHeight: '2.5rem' }}>
        <li>Download the installer below</li>
        <Button
          color="primary"
          disabled={isMacOs || !version}
          href={downloadURL}
          size="large"
          startIcon={<GetApp />}
          // style={{ color: 'var(--color-foreground)' }}
          variant="contained"
        >
          {!version && isWindows ? 'Fetching installer version...' : message}
        </Button>
        <li>
          Run the installer to install <strong>Nifty Launcher</strong> and an optional shortcut
        </li>
        <li>
          Launch the game using <strong>Nifty Launcher</strong>
        </li>
        <li>
          The game opens up <strong>nifty-league.com</strong> for account verification
        </li>
        <li>Sign a message via MetaMask or other accepted Web3 providers to verify your account</li>
        <li>
          Return to the game and <strong>SMASH</strong>!!
        </li>
      </ol>
      <p>
        <em>
          * We are in the process of obtaining a Code Signing Certificate to avoid the Windows&apos; SmartScreen warning
        </em>
      </p>
    </Container>
  );
};

const DownloadGameDialog = () => {
  return (
    <Dialog>
      {/* <DialogTrigger>
        <Button variant="outlined" color="primary" fullWidth sx={{ minWidth: 80, flex: 1 }}>
          Desktop App (Deprecated)
        </Button>
      </DialogTrigger> */}
      <DialogContent aria-labelledby="customized-dialog-title" dialogTitle="Nifty League Desktop">
        <Downloader />
      </DialogContent>
    </Dialog>
  );
};

export default DownloadGameDialog;
