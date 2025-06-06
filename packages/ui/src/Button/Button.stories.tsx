import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import NiftyButton from './Button';

const meta: Meta<typeof NiftyButton> = {
  title: 'Components/Button',
  component: NiftyButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: { type: 'select' }, options: ['primary', 'secondary', 'outline', 'ghost', 'link'] },
    size: { control: { type: 'radio' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    onClick: fn(),
    children: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    isLoading: false,
    fullWidth: false,
  },
} satisfies Meta<React.ComponentProps<typeof NiftyButton>>;

export default meta;
type Story = StoryObj<React.ComponentProps<typeof NiftyButton>>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Outline: Story = { args: { variant: 'outline' } };

export const Ghost: Story = { args: { variant: 'ghost' } };

export const Link: Story = { args: { variant: 'link' } };

export const Loading: Story = { args: { isLoading: true } };

export const Disabled: Story = { args: { disabled: true } };

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '100%', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
