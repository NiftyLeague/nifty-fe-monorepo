import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';

import { Space, IconPackage, IconChevronRight } from './../../index';
import Button, { type RefHandle } from './Button';

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

export const WithIcon: Story = { args: { icon: <IconPackage /> } };

export const WithIconRight: Story = { args: { icon: <IconChevronRight />, iconRight: true } };

export const WithBlock: Story = { args: { block: true } };

export const WithOnlyIcon: Story = { args: { icon: <IconPackage />, children: undefined } };

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
          <Button {...args} size="tiny">
            Button text
          </Button>
          <Button {...args} size="tiny" type="secondary">
            Button text
          </Button>
          <Button {...args} size="tiny" type="default">
            Button text
          </Button>
          <Button {...args} size="tiny" type="link">
            Button text
          </Button>
          <Button {...args} size="tiny" type="text">
            Button text
          </Button>
          <Button {...args} size="tiny" type="dashed">
            Button text
          </Button>
          <Button {...args} size="tiny" type="outline">
            Button text
          </Button>
        </Space>

        <Space>
          <Button {...args} size="small">
            Button text
          </Button>
          <Button {...args} size="small" type="secondary">
            Button text
          </Button>
          <Button {...args} size="small" type="default">
            Button text
          </Button>
          <Button {...args} size="small" type="link">
            Button text
          </Button>
          <Button {...args} size="small" type="text">
            Button text
          </Button>
          <Button {...args} size="small" type="dashed">
            Button text
          </Button>
          <Button {...args} size="small" type="outline">
            Button text
          </Button>
        </Space>
        <Space>
          <Button {...args}>Button text</Button>
          <Button {...args} size="medium" type="secondary">
            Button text
          </Button>
          <Button {...args} size="medium" type="default">
            Button text
          </Button>
          <Button {...args} size="medium" type="link">
            Button text
          </Button>
          <Button {...args} size="medium" type="text">
            Button text
          </Button>
          <Button {...args} size="medium" type="dashed">
            Button text
          </Button>
          <Button {...args} size="medium" type="outline">
            Button text
          </Button>
        </Space>
        <Space>
          <Button {...args} size="large">
            Button text
          </Button>
          <Button {...args} size="large" type="secondary">
            Button text
          </Button>
          <Button {...args} size="large" type="default">
            Button text
          </Button>
          <Button {...args} size="large" type="link">
            Button text
          </Button>
          <Button {...args} size="large" type="text">
            Button text
          </Button>
          <Button {...args} size="large" type="dashed">
            Button text
          </Button>
          <Button {...args} size="large" type="outline">
            Button text
          </Button>
        </Space>
        <Space>
          <Button {...args} size="xlarge">
            Button text
          </Button>
          <Button {...args} size="xlarge" type="secondary">
            Button text
          </Button>
          <Button {...args} size="xlarge" type="default">
            Button text
          </Button>
          <Button {...args} size="xlarge" type="link">
            Button text
          </Button>
          <Button {...args} size="xlarge" type="text">
            Button text
          </Button>
          <Button {...args} size="xlarge" type="dashed">
            Button text
          </Button>
          <Button {...args} size="xlarge" type="outline">
            Button text
          </Button>
        </Space>
      </Space>
    </>
  ),
};

export const WithCustomTag = (args: any) => <Button {...args}>Button text</Button>;

const icon = <IconPackage />;

WithIcon.args = { type: 'primary', icon: icon };

WithIconRight.args = { type: 'primary', iconRight: <IconChevronRight strokeWidth={2} /> };

WithStyles.args = { type: 'primary', style: { backgroundColor: 'red', color: 'yellow' } };

WithBlock.args = { type: 'primary', block: true };

WithOnlyIcon.args = { icon: icon };

WithOnlyLoading.args = { loading: true };

WithLoadingCentered.args = { loading: true, loadingCentered: true };

AllButtons.args = { loading: false, danger: false };

WithCustomTag.args = { as: 'span' };
