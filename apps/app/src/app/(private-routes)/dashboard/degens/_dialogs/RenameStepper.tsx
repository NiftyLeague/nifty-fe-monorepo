'use client';

import { cloneElement, useEffect, useState, type ReactElement } from 'react';
import Image from 'next/image';
import { cn } from '@nl/ui/utils';

import { styled } from '@nl/theme';
import { StepIconProps } from '@mui/material/StepIcon';
import Step from '@mui/material/Step';
import StepConnector from '@mui/material/StepConnector';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

import Icon, { type IconProps } from '@nl/ui/base/Icon';

const PREFIX = 'RenameStepper';

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
    color: 'var(--color-foreground)',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [`&.${classes.active}`]: { backgroundImage: 'var(--gradient-brand)', boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)' },
  [`&.${classes.completed}`]: { backgroundImage: 'var(--gradient-brand)' },
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const icons: { [index: string]: React.ReactElement } = {
  1: <Image src="/img/logos/NFTL/logo.webp" alt="NFTL" width={30} height={30} />,
  2: <Icon name="shield-check" size="xl" strokeWidth={2.5} />,
  3: <Icon name="user-round-check" size="xl" strokeWidth={2.5} />,
  4: <Icon name="check-check" size="xl" strokeWidth={2.5} />,
};

const ColorlibConnector = styled(StepConnector)({
  alternativeLabel: { top: 22 },
  active: { '& $line': { backgroundImage: 'var(--gradient-brand)' } },
  completed: { '& $line': { backgroundImage: 'var(--gradient-brand)' } },
  line: { height: 3, border: 0, backgroundColor: 'var(--color-foreground)', borderRadius: 1 },
});

function ColorlibStepIcon({ active, completed, icon }: StepIconProps) {
  return (
    <StyledIcon className={cn(classes.root, { [classes.active]: active, [classes.completed]: completed })}>
      {(() => {
        const iconElement = icons[String(icon)] as unknown as ReactElement<IconProps>;
        return iconElement ? cloneElement(iconElement, { color: active ? 'light' : 'purple' }) : null;
      })()}
    </StyledIcon>
  );
}

function getSteps() {
  return ['Obtain 1000 NFTL', 'Approve contract as NFTL spender', 'Submit rename request', 'DEGEN Renamed!'];
}

function getStepContent(step: number) {
  switch (step) {
    case 0: {
      return '1000 NFTL required to rename. Please either claim NFTL from your degen or use Uniswap to purchase.';
    }
    case 1:
      return 'Note: renaming requires two transactions since the Nifty Degen contract is not already an approved spender.';
    case 2:
      return 'Spender approved, submit rename request';
    default:
      return '';
  }
}

function RenameStepper({
  insufficientAllowance,
  renameSuccess,
  insufficientBalance,
}: {
  insufficientAllowance: boolean;
  renameSuccess: boolean;
  insufficientBalance: boolean;
}): React.ReactNode {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  useEffect(() => {
    if (renameSuccess) setActiveStep(3);
    else if (insufficientBalance) setActiveStep(0);
    else setActiveStep(insufficientAllowance ? 1 : 2);
  }, [insufficientAllowance, insufficientBalance, renameSuccess]);

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
            <StepLabel style={{ color: 'var(--color-foreground) !important' }} StepIconComponent={ColorlibStepIcon}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <em style={{ textAlign: 'center' }}>
        {activeStep !== steps.length ? (
          <StyledTypography
            className={activeStep === 0 ? 'text-error' : activeStep === 1 ? 'text-warning' : 'text-success'}
          >
            {getStepContent(activeStep)}
          </StyledTypography>
        ) : null}
      </em>
    </div>
  );
}

export default RenameStepper;
