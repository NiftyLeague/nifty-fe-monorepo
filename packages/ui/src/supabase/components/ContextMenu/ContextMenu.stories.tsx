/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { IconSettings, IconLogOut } from '../../index';
import Typography from '../Typography';

import { ContextMenu } from '.';
import { IconLogIn } from '../Icon/icons/IconLogIn';

export default {
  title: 'Navigation/ContextMenu',
  component: ContextMenu,
};

const triggerArea = (
  <div
    style={{
      background: 'gray',
      width: '280px',
      height: '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <span>Right click this area</span>
  </div>
);

export const Default = (args: any) => (
  <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
    <ContextMenu
      {...args}
      overlay={[
        <ContextMenu.Misc key="misc">
          <div>
            <Typography.Text small className="block">
              Signed in as{' '}
            </Typography.Text>

            <Typography.Text small strong>
              tom@example.com{' '}
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
      {triggerArea}
    </ContextMenu>
  </div>
);

Default.args = {};

export const doNotcloseOverlay = (args: any) => (
  <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
    <ContextMenu
      {...args}
      overlay={[
        <ContextMenu.Misc key="misc">
          <Typography.Text>Signed in as </Typography.Text>
          <Typography.Text strong>tom@example.com </Typography.Text>
        </ContextMenu.Misc>,
        <Divider key="divider3" light />,
        <ContextMenu.Item key="account">Account</ContextMenu.Item>,
        <ContextMenu.Item key="settings">Settings</ContextMenu.Item>,
        <ContextMenu.Item key="logoutButton">
          <Button icon={<IconLogOut />}>Log out</Button>
        </ContextMenu.Item>,
      ]}
    >
      {triggerArea}
    </ContextMenu>
  </div>
);

doNotcloseOverlay.args = {};

export const withCustomStyles = (args: any) => (
  <div
    style={{
      margin: '0 auto',
      minHeight: '420px',
      marginTop: '220px',
      marginLeft: '400px',
    }}
  >
    <ContextMenu
      overlayStyle={{ minWidth: '500px' }}
      placement="bottomRight"
      {...args}
      overlay={[
        <ContextMenu.Item key="signedInAs">
          <Typography.Text>Signed in as </Typography.Text>
          <Typography.Text strong>tom@example.com </Typography.Text>
        </ContextMenu.Item>,
        <Divider key="divider4" light />,
        <ContextMenu.Item key="account">Account</ContextMenu.Item>,
        <ContextMenu.Item key="settings">Settings</ContextMenu.Item>,
        <Divider key="divider5" light />,
        <ContextMenu.Item key="logout">
          <Button type="default" icon={<IconLogOut />}>
            Log out
          </Button>
        </ContextMenu.Item>,
      ]}
    >
      {triggerArea}
    </ContextMenu>
  </div>
);

withCustomStyles.args = {};

export const Checkbox = (args: any) => {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <ContextMenu
        {...args}
        overlay={[
          <ContextMenu.Item key="account" icon={<IconSettings size="small" />}>
            Account
          </ContextMenu.Item>,
          <ContextMenu.Item key="settings">Settings</ContextMenu.Item>,
          <Divider key="divider6" light />,
          <ContextMenu.Checkbox key="checkbox" checked={checked} onChange={setChecked}>
            Show subtitles
          </ContextMenu.Checkbox>,
        ]}
      >
        {triggerArea}
      </ContextMenu>
    </div>
  );
};

export const Radio = (args: any) => {
  const [value, setValue] = useState('red');

  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <ContextMenu
        {...args}
        overlay={[
          <ContextMenu.RadioGroup key="radio-group" value={value} onChange={setValue}>
            <ContextMenu.Radio key="red" value={'red'}>
              Red
            </ContextMenu.Radio>
            <ContextMenu.Radio key="blue" value={'blue'}>
              Blue
            </ContextMenu.Radio>
            <ContextMenu.Radio key="green" value={'green'}>
              Green
            </ContextMenu.Radio>
          </ContextMenu.RadioGroup>,
        ]}
      >
        {triggerArea}
      </ContextMenu>
    </div>
  );
};
