'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { styled } from '@nl/theme';
import { StepIconProps } from '@mui/material/StepIcon';
import Step from '@mui/material/Step';
import StepConnector from '@mui/material/StepConnector';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

import DoneAll from '@mui/icons-material/DoneAll';
import BurnIcon from '@mui/icons-material/Whatshot';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const PREFIX = 'TicketStepper';

const classes = {
  alternativeLabel: `${PREFIX}-alternativeLabel`,
  active: `${PREFIX}-active`,
  completed: `${PREFIX}-completed`,
  line: `${PREFIX}-line`,
  root: `${PREFIX}-root`,
};

const StyledIcon = styled('div')({
  [`&.${classes.root}`]: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [`& .${classes.active}`]: {
    backgroundImage: 'linear-gradient(89deg, #620edf 0%, #5e72eb 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  [`& .${classes.completed}`]: {
    backgroundImage: 'linear-gradient(89deg, #620edf 0%, #5e72eb 100%)',
  },
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const icons: { [index: string]: React.ReactElement } = {
  1: <Image src="/images/NFTL.png" alt="NFTL" width={30} height={30} />,
  2: <VerifiedUserIcon />,
  3: <BurnIcon />,
  4: <DoneAll />,
};

const ColorlibConnector = styled(StepConnector)({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage: 'linear-gradient(89deg, #620edf 0%, #5e72eb 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage: 'linear-gradient(89deg, #620edf 0%, #5e72eb 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
});

function ColorlibStepIcon({ active, completed, icon }: StepIconProps) {
  return (
    <StyledIcon
      className={cn(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(icon)]}
    </StyledIcon>
  );
}

function getSteps() {
  return ['Obtain 1000+ NFTL', 'Approve contract as NFTL spender', 'Burn NFTL', 'Ticket(s) Claimed!'];
}

function getStepContent(step: number) {
  switch (step) {
    case 0: {
      return '1000 NFTL minimum required for raffle tickets. Please either claim NFTL from your degen(s) or use Sushiswap to purchase.';
    }
    case 1:
      return 'Note: renaming requires two transactions since the NFTL Raffle contract is not already an approved spender.';
    case 2:
      return 'Spender approved, deposit and burn NFTL';
    default:
      return '';
  }
}

export default function TicketStepper({
  insufficientAllowance,
  purchaseSuccess,
  insufficientBalance,
}: {
  insufficientAllowance: boolean;
  purchaseSuccess: boolean;
  insufficientBalance: boolean;
}): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  useEffect(() => {
    if (purchaseSuccess) setActiveStep(3);
    else if (insufficientBalance) setActiveStep(0);
    else setActiveStep(insufficientAllowance ? 1 : 2);
  }, [insufficientAllowance, insufficientBalance, purchaseSuccess]);

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        style={{ backgroundColor: 'transparent', marginBottom: 10 }}
        connector={
          <ColorlibConnector
            classes={{
              alternativeLabel: classes.alternativeLabel,
              active: classes.active,
              completed: classes.completed,
              line: classes.line,
            }}
          />
        }
      >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel style={{ color: 'white !important' }} StepIconComponent={ColorlibStepIcon}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <em style={{ textAlign: 'center' }}>
        {activeStep !== steps.length ? <StyledTypography>{getStepContent(activeStep)}</StyledTypography> : null}
      </em>
    </div>
  );
}
