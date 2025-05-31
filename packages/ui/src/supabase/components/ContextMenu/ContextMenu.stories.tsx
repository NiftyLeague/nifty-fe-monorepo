/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { IconLogOut } from '../../index';
import Typography from '../Typography';
import { ContextMenu } from '.';
import { IconLogIn } from '../Icon/icons/IconLogIn';

// Extract the RootProps type from the ContextMenu component
type RootProps = Parameters<typeof ContextMenu>[0];

const meta: Meta<typeof ContextMenu> = {
  title: 'Navigation/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

const TriggerArea = () => (
  <div
    style={{
      background: 'gray',
      width: '280px',
      height: '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    }}
  >
    <span>Right click this area</span>
  </div>
);

export const Default: Story = {
  render: args => (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <ContextMenu
        {...args}
        overlay={[
          <ContextMenu.Misc key="misc">
            <div>
              <Typography.Text small className="block">
                Signed in as
              </Typography.Text>
              <Typography.Text small strong>
                tom@example.com
              </Typography.Text>
            </div>
          </ContextMenu.Misc>,
          <Divider key="divider1" light />,
          <ContextMenu.Label key="groupLabel">Group label</ContextMenu.Label>,
          <ContextMenu.Item key="account" onClick={() => console.log('clicked')}>
            Account
          </ContextMenu.Item>,
          <ContextMenu.Item key="settings">Settings</ContextMenu.Item>,
          <Divider key="divider2" light />,
          <ContextMenu.Item key="logout" icon={<IconLogIn size="tiny" />}>
            Log out
          </ContextMenu.Item>,
        ]}
      >
        <TriggerArea />
      </ContextMenu>
    </div>
  ),
};

export const DoNotCloseOverlay: Story = {
  render: args => (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <ContextMenu
        {...args}
        onOpenChange={open => {
          // This is a workaround since we can't directly set closeOnClickOutside
          if (open === false) return false;
          return true;
        }}
        overlay={[
          <ContextMenu.Misc key="misc">
            <Typography.Text>Signed in as </Typography.Text>
            <Typography.Text strong>tom@example.com</Typography.Text>
          </ContextMenu.Misc>,
          <Divider key="divider3" light />,
          <ContextMenu.Item key="account">Account</ContextMenu.Item>,
          <ContextMenu.Item key="settings">Settings</ContextMenu.Item>,
          <ContextMenu.Item key="logoutButton">
            <Button type="default" icon={<IconLogOut />}>
              Log out
            </Button>
          </ContextMenu.Item>,
        ]}
      >
        <TriggerArea />
      </ContextMenu>
    </div>
  ),
};

export const WithCustomStyles: Story = {
  render: args => (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px', marginLeft: '400px' }}>
      <ContextMenu
        {...args}
        style={{ minWidth: '500px' }}
        overlay={[
          <ContextMenu.Misc key="misc">
            <Typography.Text>Signed in as </Typography.Text>
            <Typography.Text strong>tom@example.com</Typography.Text>
          </ContextMenu.Misc>,
          <Divider key="divider4" light />,
          <ContextMenu.Item key="account">Account</ContextMenu.Item>,
          <ContextMenu.Item key="settings">Settings</ContextMenu.Item>,
          <ContextMenu.Item key="logout" icon={<IconLogOut />}>
            Log out
          </ContextMenu.Item>,
        ]}
      >
        <TriggerArea />
      </ContextMenu>
    </div>
  ),
};

// Components with hooks need to be defined outside the stories
const CheckboxMenu = (props: RootProps) => {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <ContextMenu
        {...props}
        overlay={[
          <ContextMenu.Checkbox key="checkbox" checked={checked} onChange={() => setChecked(!checked)}>
            Checkbox
          </ContextMenu.Checkbox>,
        ]}
      >
        <TriggerArea />
      </ContextMenu>
    </div>
  );
};

export const WithCheckbox: Story = {
  render: args => <CheckboxMenu {...args} />,
};

const RadioMenu = (props: RootProps) => {
  const [value, setValue] = useState('one');
  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <ContextMenu
        {...props}
        overlay={[
          <ContextMenu.RadioGroup key="radio-group" value={value} onChange={value => setValue(value as string)}>
            <ContextMenu.Radio value="one">One</ContextMenu.Radio>
            <ContextMenu.Radio value="two">Two</ContextMenu.Radio>
            <ContextMenu.Radio value="three">Three</ContextMenu.Radio>
          </ContextMenu.RadioGroup>,
        ]}
      >
        <TriggerArea />
      </ContextMenu>
    </div>
  );
};

export const WithRadio: Story = {
  render: args => <RadioMenu {...args} />,
};
