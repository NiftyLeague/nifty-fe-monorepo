import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './';

const meta: Meta<typeof Badge> = {
  title: 'Displays/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Hello world' },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const WithColor: Story = { args: { color: 'red' } };

export const WithDot: Story = { args: { dot: true } };

export const Large: Story = { args: { size: 'large' } };

export const WithDotLarge: Story = { args: { size: 'large', dot: true } };
