import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import React, { useState } from 'react';
import { Button, Typography } from '../../index';
import { SidePanel } from './index';

type SidePanelProps = React.ComponentProps<typeof SidePanel> & {
  // Add any additional props that might be passed to the component
  className?: string;
};

// Create a wrapper component to handle state for interactive stories
interface InteractiveSidePanelProps {
  args: Partial<SidePanelProps>;
  children: React.ReactNode;
}

const InteractiveSidePanel = ({ args, children }: InteractiveSidePanelProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setVisible(true)}>
        Open SidePanel
      </Button>
      <SidePanel
        {...args}
        visible={visible}
        onCancel={() => setVisible(false)}
        onConfirm={() => {
          console.log('Confirmed');
          setVisible(false);
        }}
      >
        {children}
      </SidePanel>
    </>
  );
};

const meta: Meta<SidePanelProps> = {
  title: 'Overlays/SidePanel',
  component: SidePanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { onCancel: { action: 'onCancel' }, onConfirm: { action: 'onConfirm' } },
  args: { visible: true, onCancel: fn(), onConfirm: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <SidePanel {...args}>
      <Typography.Text type="secondary">
        SidePanel content is inserted here, if you need to insert anything into the SidePanel you can do so via{' '}
        <Typography.Text code>{'{children}'}</Typography.Text>
      </Typography.Text>
    </SidePanel>
  ),
};

export const WithWideLayout: Story = {
  args: { wide: true, className: 'w-[800px]' },
  render: args => (
    <SidePanel {...args}>
      <Typography.Text type="secondary">This is a wider side panel with custom width.</Typography.Text>
    </SidePanel>
  ),
};

export const LeftAlignedFooter: Story = {
  args: { alignFooter: 'left' },
  render: args => (
    <SidePanel {...args}>
      <Typography.Text type="secondary">This side panel has a left-aligned footer.</Typography.Text>
    </SidePanel>
  ),
};

export const LeftAligned: Story = {
  args: { align: 'left' },
  render: args => (
    <SidePanel {...args}>
      <Typography.Text type="secondary">This side panel is aligned to the left.</Typography.Text>
    </SidePanel>
  ),
};

export const HideFooter: Story = {
  args: { hideFooter: true },
  render: args => (
    <SidePanel {...args}>
      <Typography.Text type="secondary">This side panel has no footer.</Typography.Text>
    </SidePanel>
  ),
};

export const CustomFooter: Story = {
  args: {
    customFooter: (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button type="secondary">Cancel</Button>
        <Button>Submit</Button>
      </div>
    ),
  },
  render: args => (
    <SidePanel {...args}>
      <Typography.Text type="secondary">This side panel has a custom footer with custom buttons.</Typography.Text>
    </SidePanel>
  ),
};

export const TriggerElement: Story = {
  render: args => (
    <InteractiveSidePanel args={args}>
      <Typography.Text type="secondary">This side panel is controlled by a trigger button.</Typography.Text>
    </InteractiveSidePanel>
  ),
};

const NestedPanel = () => {
  const [nestedVisible, setNestedVisible] = React.useState(false);

  return (
    <InteractiveSidePanel
      args={{
        title: 'Parent Panel',
        children: (
          <>
            <Button type="default" onClick={() => setNestedVisible(true)}>
              Open Nested Panel
            </Button>
            <Typography.Text type="secondary" style={{ display: 'block', marginTop: '1rem' }}>
              This is the parent side panel. Click the button above to open a nested panel.
            </Typography.Text>

            <SidePanel
              title="Nested Side Panel"
              visible={nestedVisible}
              onCancel={() => setNestedVisible(false)}
              onConfirm={() => {
                console.log('Nested panel confirmed');
                setNestedVisible(false);
              }}
            >
              <Typography.Text type="secondary">
                This is a nested side panel. You can have multiple levels of nested side panels.
              </Typography.Text>
            </SidePanel>
          </>
        ),
      }}
    >
      <Typography.Text type="secondary">
        This is the parent panel. Use the button to open a nested panel.
      </Typography.Text>
    </InteractiveSidePanel>
  );
};

export const NestedSidepanels: Story = { render: () => <NestedPanel /> };

Default.args = {
  title: 'This is the title of the SidePanel',
  description: 'And I am the description',
  visible: true,
  onCancel: fn(),
  onConfirm: fn(),
};

WithWideLayout.args = { ...Default.args, title: 'Wide Layout', wide: true, className: 'w-[800px]' };

LeftAlignedFooter.args = { ...Default.args, title: 'Left Aligned Footer', alignFooter: 'left' };

LeftAligned.args = { ...Default.args, title: 'Left Aligned', align: 'left' };

HideFooter.args = { ...Default.args, title: 'Hidden Footer', hideFooter: true };

CustomFooter.args = {
  ...Default.args,
  title: 'Custom Footer',
  description: 'This panel has a custom footer',
  customFooter: (
    <div style={{ display: 'flex', gap: '8px', padding: '16px' }}>
      <Button type="secondary">Cancel</Button>
      <Button>Submit</Button>
    </div>
  ),
};

TriggerElement.args = {
  ...Default.args,
  title: 'Trigger Element',
  description: 'This panel is controlled by a trigger button',
  triggerElement: <Button as="span">Open</Button>,
};
