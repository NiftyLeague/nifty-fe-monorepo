'use client';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Container, Link, Typography } from '@mui/material';
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog';

const PREFIX = 'WhitelistDialog';

const classes = {
  form: `${PREFIX}-form`,
  inputEmail: `${PREFIX}-inputEmail`,
  submitButton: `${PREFIX}-submitButton`,
};

const StyledDialog = styled(Dialog)(() => ({
  [`& .${classes.form}`]: {
    display: 'flex',
    width: '100%',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  },

  [`& .${classes.inputEmail}`]: {
    flex: 1,
    background: '#5D5F74',
    borderRadius: '2px',
    border: 'none',
    padding: '13px 16px',
    letterSpacing: '-0.02em',
    color: '#FAFAFA',
    outline: 'none',
    fontSize: '16px',
    '&::placeholder': {
      color: '#B4B5C3',
    },
    '@media (max-width: 768px)': {
      borderRadius: '5px',
    },
  },

  [`& .${classes.submitButton}`]: {
    background: '#620EDF',
    borderRadius: '0px 5px 5px 0px',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 36px',
    fontSize: '14px',
    lineHeight: '28px',
    letterSpacing: '-0.02em',
    color: '#FAFAFA',
    fontWeight: 700,
    '@media (max-width: 768px)': {
      marginTop: 8,
      borderRadius: '5px',
    },
  },
}));

export const WhitelistModal = (): JSX.Element => {
  const [email, setEmail] = useState('');

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Need to integrate whitelist api here
    e.preventDefault();
  };

  return (
    <Container sx={{ textAlign: 'center', pt: { xs: 1, md: 4 }, px: 0 }}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          name="email"
          type="email"
          value={email}
          placeholder="Enter your email"
          required
          aria-required="true"
          onChange={handleChangeEmail}
          className={classes.inputEmail}
        />
        <button type="submit" className={classes.submitButton}>
          Get Access
        </button>
      </form>
      <Typography variant="body1" mt={3.5}>
        Not into email? Follow on{' '}
        <Link
          href="https://twitter.com/NiftyLeague"
          target="_blank"
          rel="noreferrer"
          sx={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          Twitter
        </Link>{' '}
        or{' '}
        <Link
          href="https://niftyleague.medium.com"
          target="_blank"
          rel="noreferrer"
          sx={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          Medium
        </Link>
      </Typography>
    </Container>
  );
};

const WhitelistDialog = () => {
  const whitelistEnabled = false;
  return (
    <StyledDialog>
      <DialogTrigger>
        <Button variant="outlined" fullWidth disabled>
          {whitelistEnabled ? 'Get Notified' : 'Play in Browser'}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-labelledby="exclusive-access-to-nifty-tennis"
        dialogTitle={`Get Notified When\nNifty Tennis Is Out!`}
        sx={{
          '& .MuiPaper-root': {
            maxWidth: 473,
          },
          '& h2': {
            fontSize: { xs: '22px', md: '28px' },
            lineHeight: { xs: '28px', md: '36px' },
            textAlign: 'center',
            paddingTop: '36px',
            whiteSpace: 'pre-line',
          },
          '& .MuiDialogContent-root': {
            border: 'none',
            paddingBottom: '36px',
          },
        }}
      >
        <WhitelistModal />
      </DialogContent>
    </StyledDialog>
  );
};

export default WhitelistDialog;
