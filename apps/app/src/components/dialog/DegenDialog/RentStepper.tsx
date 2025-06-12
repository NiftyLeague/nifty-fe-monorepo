'use client';
import { useEffect, useState } from 'react';
import cn from 'classnames';

import { styled } from '@nl/theme';
import { StepIconProps } from '@mui/material/StepIcon';
import Step from '@mui/material/Step';
import StepConnector from '@mui/material/StepConnector';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

const PREFIX = 'RentStepper';

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

const ColorlibConnector = styled(StepConnector)({
  alternativeLabel: { top: 22 },
  active: { '& $line': { backgroundImage: 'var(--gradient-brand)' } },
  completed: { '& $line': { backgroundImage: 'var(--gradient-brand)' } },
  line: { height: 3, border: 0, backgroundColor: '#eaeaf0', borderRadius: 1 },
});

function ColorlibStepIcon({ active, completed }: StepIconProps) {
  return <StyledIcon className={cn(classes.root, { [classes.active]: active, [classes.completed]: completed })} />;
}

const steps = ['Connect Wallet', 'Check Balance', 'Success'];

export default function RentStepper({
  rentSuccess,
  checkBalance,
}: {
  rentSuccess: boolean;
  checkBalance: boolean;
}): React.ReactNode {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (rentSuccess) setActiveStep(2);
    else if (checkBalance) setActiveStep(1);
  }, [checkBalance, rentSuccess]);

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
    </div>
  );
}
