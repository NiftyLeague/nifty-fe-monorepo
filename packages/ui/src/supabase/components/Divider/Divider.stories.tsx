import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Space } from '../Space';
import Typography from '../Typography';
import { Divider } from './';

const meta: Meta<typeof Divider> = {
  title: 'Utilities/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
    },
    type: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    light: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {},
};

export const WithCenterText: Story = {
  args: {
    children: 'Hello world',
  },
};

export const WithLeftText: Story = {
  args: {
    children: 'Hello world',
    orientation: 'left',
  },
};

export const WithRightText: Story = {
  args: {
    children: 'Hello world',
    orientation: 'right',
  },
};

export const LighterColor: Story = {
  args: {
    light: true,
  },
};

export const Vertical: Story = {
  render: (args: any) => (
    <div style={{ height: '32px' }}>
      <Space style={{ height: '100%' }}>
        <Divider {...args} type="vertical" />
        <Button>Button one</Button>
        <Divider {...args} type="vertical" />
        <Button>Button two</Button>
        <Divider {...args} type="vertical" />
        <Typography.Text>Some text</Typography.Text>
        <Divider {...args} type="vertical" />
        <Button>Button three</Button>
      </Space>
    </div>
  ),
  args: {
    type: 'vertical',
  },
};
