import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import Icon from '@nl/ui/base/Icon';

import Space from '../Space';
import Button, { type RefHandle } from './Button';
import './Button.module.css';

const meta: Meta<typeof Button> = {
  title: 'General/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button text' },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const WithStyles: Story = {};

export const WithIcon: Story = { args: { icon: 'package' } };

export const WithIconRight: Story = { args: { iconRight: 'chevron-right' } };

export const WithBlock: Story = { args: { block: true } };

export const WithOnlyIcon: Story = { args: { icon: 'package', children: undefined } };

export const WithOnlyLoading: Story = { args: { loading: true, children: undefined } };

export const WithLoadingCentered: Story = {
  args: { loading: true, loadingCentered: true, children: 'Loading icon is centered' },
};

export const WithRef: Story = {
  render: function WithRefStory() {
    const buttonRef = useRef<RefHandle>(null);
    const [msg, setMsg] = useState('Click button to console.log Ref');

    function onClick() {
      const message = `container: ${buttonRef?.current?.container} button:${buttonRef?.current?.button}  `;
      setMsg(message);
      console.log(message);
    }

    return (
      <>
        <Button ref={buttonRef} onClick={onClick}>
          Button with forwardRef
        </Button>
        <p style={{ color: '#666666' }}>{msg}</p>
      </>
    );
  },
};

export const AllButtons: Story = {
  render: args => (
    <>
      <Space direction="vertical" size={6}>
        <Space>
          <Button {...args} size="xs">
            Button text
          </Button>
          <Button {...args} size="xs" type="secondary">
            Button text
          </Button>
          <Button {...args} size="xs" type="default">
            Button text
          </Button>
          <Button {...args} size="xs" type="link">
            Button text
          </Button>
          <Button {...args} size="xs" type="text">
            Button text
          </Button>
          <Button {...args} size="xs" type="dashed">
            Button text
          </Button>
          <Button {...args} size="xs" type="outline">
            Button text
          </Button>
        </Space>

        <Space>
          <Button {...args} size="sm">
            Button text
          </Button>
          <Button {...args} size="sm" type="secondary">
            Button text
          </Button>
          <Button {...args} size="sm" type="default">
            Button text
          </Button>
          <Button {...args} size="sm" type="link">
            Button text
          </Button>
          <Button {...args} size="sm" type="text">
            Button text
          </Button>
          <Button {...args} size="sm" type="dashed">
            Button text
          </Button>
          <Button {...args} size="sm" type="outline">
            Button text
          </Button>
        </Space>
        <Space>
          <Button {...args}>Button text</Button>
          <Button {...args} size="md" type="secondary">
            Button text
          </Button>
          <Button {...args} size="md" type="default">
            Button text
          </Button>
          <Button {...args} size="md" type="link">
            Button text
          </Button>
          <Button {...args} size="md" type="text">
            Button text
          </Button>
          <Button {...args} size="md" type="dashed">
            Button text
          </Button>
          <Button {...args} size="md" type="outline">
            Button text
          </Button>
        </Space>
        <Space>
          <Button {...args} size="lg">
            Button text
          </Button>
          <Button {...args} size="lg" type="secondary">
            Button text
          </Button>
          <Button {...args} size="lg" type="default">
            Button text
          </Button>
          <Button {...args} size="lg" type="link">
            Button text
          </Button>
          <Button {...args} size="lg" type="text">
            Button text
          </Button>
          <Button {...args} size="lg" type="dashed">
            Button text
          </Button>
          <Button {...args} size="lg" type="outline">
            Button text
          </Button>
        </Space>
        <Space>
          <Button {...args} size="xl">
            Button text
          </Button>
          <Button {...args} size="xl" type="secondary">
            Button text
          </Button>
          <Button {...args} size="xl" type="default">
            Button text
          </Button>
          <Button {...args} size="xl" type="link">
            Button text
          </Button>
          <Button {...args} size="xl" type="text">
            Button text
          </Button>
          <Button {...args} size="xl" type="dashed">
            Button text
          </Button>
          <Button {...args} size="xl" type="outline">
            Button text
          </Button>
        </Space>
      </Space>
    </>
  ),
};

export const WithCustomTag = (args: any) => <Button {...args}>Button text</Button>;

WithIcon.args = { type: 'primary', icon: 'package' };

WithIconRight.args = { type: 'primary', iconRight: 'chevron-right' };

WithStyles.args = { type: 'primary', style: { backgroundColor: 'red', color: 'yellow' } };

WithBlock.args = { type: 'primary', block: true };

WithOnlyIcon.args = { icon: 'package' };

WithOnlyLoading.args = { loading: true };

WithLoadingCentered.args = { loading: true, loadingCentered: true };

AllButtons.args = { loading: false, danger: false };

WithCustomTag.args = { as: 'span' };
