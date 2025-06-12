import React from 'react';
import { AnimatedWrapper } from '../AnimatedWrapper';

export const AnimationExample: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Basic fade in */}
      <AnimatedWrapper
      // config={{
      //   type: AnimationType.Fade,
      //   direction: AnimationDirection.Left,
      //   amount: AnimationAmount.Medium,
      //   speed: AnimationSpeed.Fast,
      //   easing: AnimationEasing.EaseIn,
      // }}
      >
        <div className="p-4 bg-background text-foreground rounded">Fade in content</div>
      </AnimatedWrapper>

      {/* Slide in from left */}
      <AnimatedWrapper
      // config={{
      //   type: AnimationType.Slide,
      //   direction: AnimationDirection.Left,
      //   amount: AnimationAmount.Medium,
      //   speed: AnimationSpeed.Normal,
      //   easing: AnimationEasing.EaseOut,
      // }}
      >
        <div className="p-4 bg-blue-100 rounded">Slide in content</div>
      </AnimatedWrapper>
    </div>
  );
};
