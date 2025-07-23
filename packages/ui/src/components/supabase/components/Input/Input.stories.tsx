import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@nl/ui/base/icon';
import { Input } from '.';
import { Button } from '../Button';

const meta: Meta<typeof Input> = { title: 'Data Input/Input', component: Input, parameters: { layout: 'centered' } };

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Type text here ...', disabled: false, label: 'Name', layout: 'vertical' },
};

export const WithError: Story = {
  args: { ...Default.args, label: 'Input with an error message', error: 'This field is required' },
};

export const WithIcon: Story = {
  args: { ...Default.args, label: 'Search', icon: <Icon name="search" />, placeholder: 'Search...' },
};

export const WithOptional: Story = { args: { ...Default.args, label: 'Optional Field', labelOptional: '(optional)' } };

export const WithDescription: Story = {
  args: {
    ...Default.args,
    label: 'Input with description',
    descriptionText: 'This is a description of what this input is for',
  },
};

export const WithCustomWidth: Story = {
  args: { ...Default.args, label: 'Custom width input', style: { width: '300px' } },
};

export const WithRevealAndCopy: Story = {
  args: {
    ...Default.args,
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password...',
    reveal: true,
    copy: true,
  },
};

export const WithCustomActions: Story = {
  args: {
    ...Default.args,
    label: 'Input with actions',
    value: 'Editable text',
    actions: [
      <Button key="action1" type="default" size="xs">
        Action 1
      </Button>,
      <Button key="action2" type="default" size="xs">
        Action 2
      </Button>,
    ],
  },
};

export const WithBeforeAndAfterLabel: Story = {
  args: { ...Default.args, beforeLabel: 'Before', afterLabel: 'After', label: 'Input with labels' },
};

export const CustomSize: Story = { args: { ...Default.args, label: 'Large Input', size: 'lg' } };

export const Borderless: Story = { args: { ...Default.args, label: 'Borderless Input', borderless: true } };

export const DateInput: Story = { args: { ...Default.args, type: 'date', label: 'Date Input' } };
