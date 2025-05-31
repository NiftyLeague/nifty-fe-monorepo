import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Modal } from '.';
import Typography from '../Typography';
import { Button } from '../Button';
import { Dropdown } from '../Dropdown';
import { IconTrash, IconAlertCircle, IconCheck } from './../../index';
import { Space } from '../Space';

const meta: Meta<typeof Modal> = {
  title: 'Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    visible: true,
    title: 'This is the title of the modal',
    description: 'And i am the description',
    children: (
      <Typography.Text type="secondary">
        Modal content is inserted here, if you need to insert anything into the Modal you can do so via{' '}
        <Typography.Text code>{'{children}'}</Typography.Text>
      </Typography.Text>
    ),
  },
  argTypes: {
    onCancel: { action: 'cancel' },
    onConfirm: { action: 'confirm' },
    icon: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Common icon for all stories
const icon = <IconAlertCircle size="xlarge" />;

// Basic Modal with icon
export const Default: Story = {
  args: {
    icon,
  },
};

// Modal with close button
export const WithCloseButton: Story = {
  args: {
    closable: true,
    icon,
    children: 'This Modal has a close button on the top right',
  },
};

// Modal with footer buttons
export const WithFooter: Story = {
  args: {
    icon,
    customFooter: (
      <Space>
        <Button type="outline">Cancel</Button>
        <Button type="primary">Confirm</Button>
      </Space>
    ),
  },
};

// Modal with right-aligned footer
export const RightAlignedFooter: Story = {
  args: {
    icon,
    alignFooter: 'right',
    customFooter: (
      <Space>
        <Button type="outline">Cancel</Button>
        <Button type="primary">Confirm</Button>
      </Space>
    ),
  },
};

// Modal without footer
export const HideFooter: Story = {
  args: {
    icon,
    hideFooter: true,
  },
};

// Modal with long content
const LongContent = () => (
  <div>
    {Array(30)
      .fill(null)
      .map((_, i) => (
        <p key={i}>Modal content line {i + 1}</p>
      ))}
  </div>
);

export const LongModal: Story = {
  args: {
    icon,
    children: <LongContent />,
  },
};

// Modal with dropdown
const DropdownModal = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Dropdown Modal</Button>
      <Modal visible={visible} onCancel={() => setVisible(false)} hideFooter icon={icon}>
        <Dropdown
          overlay={
            <>
              <Dropdown.Item>Item 1</Dropdown.Item>
              <Dropdown.Item>Item 2</Dropdown.Item>
              <Dropdown.Item>Item 3</Dropdown.Item>
            </>
          }
        >
          <Button type="outline" iconRight={<IconTrash />}>
            Click me
          </Button>
        </Dropdown>
      </Modal>
    </>
  );
};

export const WithDropdowns: Story = {
  render: () => <DropdownModal />,
};

// Modal with custom footer
const CustomFooterExample = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Custom Footer Modal</Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Custom Footer Example"
        hideFooter
        customFooter={
          <div className="flex items-center justify-between w-full">
            <Button type="outline" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              <Button type="outline" onClick={() => console.log('Save as draft')}>
                Save as draft
              </Button>
              <Button type="primary" onClick={() => console.log('Publish')}>
                Publish
              </Button>
            </div>
          </div>
        }
      >
        <Typography.Text>Custom footer content goes here</Typography.Text>
      </Modal>
    </>
  );
};

export const CustomFooter: Story = {
  render: () => <CustomFooterExample />,
};

// Payment success modal
const PaymentSuccessModal = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Payment Success</Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        hideFooter
        customFooter={
          <div className="flex items-center justify-center w-full">
            <Button type="primary" onClick={() => setVisible(false)}>
              Got it
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <IconCheck className="text-green-600" size={24} strokeWidth={2} />
          </div>
          <Typography.Title level={4}>Payment successful</Typography.Title>
          <Typography.Text type="secondary" className="mt-2">
            Your payment has been successfully submitted. We&apos;ve sent you an email with all of the details of your
            order.
          </Typography.Text>
        </div>
      </Modal>
    </>
  );
};

export const PaymentSuccess: Story = {
  render: () => <PaymentSuccessModal />,
};
