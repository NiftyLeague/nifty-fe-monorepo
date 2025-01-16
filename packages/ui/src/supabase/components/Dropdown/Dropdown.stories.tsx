/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { IconSettings, IconLogOut, IconChevronDown } from './../../index';
import Typography from '../Typography';

import { Dropdown } from './';
import { IconLogIn } from '../Icon/icons/IconLogIn';
import { Input } from '../Input';
import { IconSearch } from '../Icon/icons/IconSearch';

export default {
  title: 'Navigation/Dropdown',
  component: Dropdown,
};

export const Default = (args: any) => (
  <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
    <Dropdown
      {...args}
      overlay={[
        <Dropdown.Misc key="misc-1">
          <div>
            <Typography.Text small className="block">
              Signed in as{' '}
            </Typography.Text>

            <Typography.Text small strong>
              tom@example.com{' '}
            </Typography.Text>
          </div>
        </Dropdown.Misc>,
        <Divider light key="divider-1" />,
        <Dropdown.Label key="label-1">Group label</Dropdown.Label>,
        <Dropdown.Item key="item-1" onClick={() => console.log('clicked')}>
          Account
        </Dropdown.Item>,
        <Dropdown.Item key="item-2">Settings</Dropdown.Item>,
        <Divider light key="divider-2" />,
        <Dropdown.Item key="item-3" icon={<IconLogIn size="tiny" />}>
          Log out
        </Dropdown.Item>,
      ]}
    >
      <Button as="span" type="outline" iconRight={<IconChevronDown />}>
        Click for dropdown
      </Button>
    </Dropdown>
  </div>
);

Default.args = {};

export const doNotcloseOverlay = (args: any) => (
  <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
    <Dropdown
      {...args}
      overlay={[
        <Dropdown.Misc key="misc-2">
          <Typography.Text>Signed in as </Typography.Text>
          <Typography.Text strong>tom@example.com </Typography.Text>
        </Dropdown.Misc>,
        <Divider light key="divider-1" />,
        <Dropdown.Item key="item-4">Account</Dropdown.Item>,
        <Dropdown.Item key="item-5">Settings</Dropdown.Item>,
        <Dropdown.Item key="item-6">
          <Button icon={<IconLogOut />}>Log out</Button>
        </Dropdown.Item>,
      ]}
    >
      <Button as="span" type="outline" iconRight={<IconChevronDown />}>
        Click for dropdown
      </Button>
    </Dropdown>
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
    <Dropdown
      overlayStyle={{ minWidth: '500px' }}
      placement="bottomRight"
      {...args}
      overlay={[
        <Dropdown.Item key="item-7">
          <Typography.Text>Signed in as </Typography.Text>
          <Typography.Text strong>tom@example.com </Typography.Text>
        </Dropdown.Item>,
        <Divider light key="divider-1" />,
        <Dropdown.Item key="item-8">Account</Dropdown.Item>,
        <Dropdown.Item key="item-8">Settings</Dropdown.Item>,
        <Divider light key="divider-2" />,
        <Dropdown.Item key="item-9">
          <Button type="default" icon={<IconLogOut />}>
            Log out
          </Button>
        </Dropdown.Item>,
      ]}
    >
      <Button as="span" type="outline" iconRight={<IconChevronDown />}>
        Click for dropdown
      </Button>
    </Dropdown>
  </div>
);

withCustomStyles.args = {};

export const SearchList = (args: any) => (
  <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
    <Dropdown
      {...args}
      overlay={[
        <Dropdown.Item key="item-0">
          <Input size="tiny" icon={<IconSearch />} autoFocus={false} />
        </Dropdown.Item>,
        <Dropdown.Item key="item-10">
          <Typography.Text>Signed in as </Typography.Text>
          <Typography.Text strong>tom@example.com </Typography.Text>
        </Dropdown.Item>,
        <Dropdown.Item key="item-11">
          <Typography.Text>Signed in as </Typography.Text>
          <Typography.Text strong>tom@example.com </Typography.Text>
        </Dropdown.Item>,
        <Divider light key="divider-1" />,
        <Dropdown.Item key="item-9" icon={<IconLogIn />}>
          <Typography.Text>Log out</Typography.Text>
        </Dropdown.Item>,
      ]}
    >
      <Button as="span" type="outline" iconRight={<IconChevronDown />}>
        Click for dropdown
      </Button>
    </Dropdown>
  </div>
);

SearchList.args = {};

export const Checkbox = (args: any) => {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <Dropdown
        {...args}
        overlay={[
          <Dropdown.Item key="item-10" icon={<IconSettings size="small" />}>
            Account
          </Dropdown.Item>,
          <Dropdown.Item key="item-11">Settings</Dropdown.Item>,
          <Divider light key="divider-1" />,
          <Dropdown.Checkbox key="checkbox-1" checked={checked} onChange={setChecked}>
            Show subtitles
          </Dropdown.Checkbox>,
        ]}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          Click for dropdown
        </Button>
      </Dropdown>
    </div>
  );
};

export const Radio = (args: any) => {
  const [value, setValue] = useState('red');

  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <Dropdown
        {...args}
        overlay={[
          <Dropdown.RadioGroup key="radio-group" value={value} onChange={setValue}>
            <Dropdown.Radio value={'red'}>Red</Dropdown.Radio>
            <Dropdown.Radio value={'blue'}>Blue</Dropdown.Radio>
            <Dropdown.Radio value={'green'}>Green</Dropdown.Radio>
          </Dropdown.RadioGroup>,
        ]}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          Click for dropdown
        </Button>
      </Dropdown>
    </div>
  );
};

export const Nested = (args: any) => {
  const [value, setValue] = useState('red');

  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <Dropdown
        {...args}
        overlay={
          <>
            <Dropdown.RadioGroup value={value} onChange={setValue}>
              <Dropdown.Radio value={'red'}>Red</Dropdown.Radio>
              <Dropdown.Radio value={'blue'}>Blue</Dropdown.Radio>
              <Dropdown.Radio value={'green'}>Green</Dropdown.Radio>
            </Dropdown.RadioGroup>

            <Dropdown
              isNested
              overlay={[
                <Dropdown.RadioGroup key="radio-group" value={value} onChange={setValue}>
                  <Dropdown.Radio value={'red'}>Red</Dropdown.Radio>
                  <Dropdown.Radio value={'blue'}>Blue</Dropdown.Radio>
                  <Dropdown.Radio value={'green'}>Green</Dropdown.Radio>
                </Dropdown.RadioGroup>,
              ]}
            >
              <Dropdown.TriggerItem>Open sub menu</Dropdown.TriggerItem>
            </Dropdown>
            <Dropdown.Item>hello</Dropdown.Item>
          </>
        }
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          Click for dropdown
        </Button>
      </Dropdown>
    </div>
  );
};
