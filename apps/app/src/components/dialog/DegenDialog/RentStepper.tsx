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

function ColorlibStepIcon({ active, completed }: StepIconProps) {
  return (
    <StyledIcon
      className={cn(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    />
  );
}

const steps = ['Connect Wallet', 'Check Balance', 'Success'];

export default function RentStepper({
  rentSuccess,
  checkBalance,
}: {
  rentSuccess: boolean;
  checkBalance: boolean;
}): JSX.Element {
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
            <StepLabel style={{ color: 'white !important' }} StepIconComponent={ColorlibStepIcon}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
