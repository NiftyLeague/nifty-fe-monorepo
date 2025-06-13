import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { IconSettings, IconLogOut, IconChevronDown } from '../../index';
import Typography from '../Typography';
import { Dropdown } from './';
import type { RootProps } from './Dropdown';
import { IconLogIn } from '../Icon/icons/IconLogIn';
import { Input } from '../Input';
import { IconSearch } from '../Icon/icons/IconSearch';

// Define the story type
type DropdownStory = StoryObj<typeof Dropdown>;

const meta: Meta<typeof Dropdown> = {
  title: 'Navigation/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    overlay: { control: { disable: true } },
    children: { control: { disable: true } },
    side: { control: { type: 'select' }, options: ['bottom', 'top', 'left', 'right'] },
    align: { control: { type: 'select' }, options: ['start', 'center', 'end'] },
  },
  args: { side: 'bottom', align: 'center', sideOffset: 6 },
};

export default meta;
// Remove duplicate Story type

const DefaultTemplate: DropdownStory = {
  render: args => (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <Dropdown
        {...args}
        overlay={[
          <Dropdown.Misc key="misc-1">
            <div>
              <Typography.Text small className="block">
                Signed in as
              </Typography.Text>
              <Typography.Text small strong>
                tom@example.com
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
  ),
};

export const Default: DropdownStory = DefaultTemplate;

const DoNotCloseOverlayTemplate: DropdownStory = {
  render: args => (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <Dropdown
        {...args}
        overlay={[
          <Dropdown.Misc key="misc-2">
            <Typography.Text>Signed in as </Typography.Text>
            <Typography.Text strong>tom@example.com</Typography.Text>
          </Dropdown.Misc>,
          <Divider light key="divider-3" />,
          <Dropdown.Item key="item-4">Account</Dropdown.Item>,
          <Dropdown.Item key="item-5">Settings</Dropdown.Item>,
          <Dropdown.Item key="item-6">
            <Button icon={<IconLogOut />}>Log out</Button>
          </Dropdown.Item>,
        ]}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          Click for dropdown (doesn&apos;t close on click inside)
        </Button>
      </Dropdown>
    </div>
  ),
};

export const DoNotCloseOverlay: DropdownStory = DoNotCloseOverlayTemplate;

const WithCustomStylesTemplate: DropdownStory = {
  render: args => (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px', marginLeft: '400px' }}>
      <Dropdown
        {...args}
        style={{ minWidth: '500px' }}
        overlay={[
          <Dropdown.Item key="signedInAs">
            <Typography.Text>Signed in as </Typography.Text>
            <Typography.Text strong>tom@example.com</Typography.Text>
          </Dropdown.Item>,
          <Divider light key="divider-4" />,
          <Dropdown.Item key="account">Account</Dropdown.Item>,
          <Dropdown.Item key="settings">Settings</Dropdown.Item>,
          <Divider light key="divider-5" />,
          <Dropdown.Item key="logout">
            <Button type="default" icon={<IconLogOut />}>
              Log out
            </Button>
          </Dropdown.Item>,
        ]}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          Custom styles
        </Button>
      </Dropdown>
    </div>
  ),
};

export const WithCustomStyles: DropdownStory = WithCustomStylesTemplate;

const SearchListComponent = (args: RootProps) => {
  const [search, setSearch] = useState('');
  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <Dropdown
        {...args}
        overlay={[
          <div key="search-input" className="px-3 py-2">
            <Input
              icon={<IconSearch />}
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>,
          <Divider light key="divider-6" />,
          <Dropdown.Item key="search-1">Search result 1</Dropdown.Item>,
          <Dropdown.Item key="search-2">Search result 2</Dropdown.Item>,
          <Dropdown.Item key="search-3">Search result 3</Dropdown.Item>,
        ]}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          Search list
        </Button>
      </Dropdown>
    </div>
  );
};

const SearchListTemplate: DropdownStory = { render: args => <SearchListComponent {...args} /> };

export const SearchList: DropdownStory = SearchListTemplate;

const CheckboxComponent = (args: RootProps) => {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <Dropdown
        {...args}
        overlay={[
          <Dropdown.Checkbox key="checkbox-1" checked={checked} onChange={() => setChecked(!checked)}>
            Show subtitles
          </Dropdown.Checkbox>,
        ]}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          Checkbox
        </Button>
      </Dropdown>
    </div>
  );
};

const CheckboxTemplate: DropdownStory = { render: args => <CheckboxComponent {...args} /> };

export const Checkbox: DropdownStory = CheckboxTemplate;

const RadioComponent = (args: RootProps) => {
  const [value, setValue] = useState('red');
  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <Dropdown
        {...args}
        overlay={[
          <Dropdown.RadioGroup key="radio-group" value={value} onChange={setValue}>
            <Dropdown.Radio key="red" value="red">
              Red
            </Dropdown.Radio>
            <Dropdown.Radio key="blue" value="blue">
              Blue
            </Dropdown.Radio>
            <Dropdown.Radio key="green" value="green">
              Green
            </Dropdown.Radio>
          </Dropdown.RadioGroup>,
        ]}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          Radio
        </Button>
      </Dropdown>
    </div>
  );
};

const RadioTemplate: DropdownStory = { render: args => <RadioComponent {...args} /> };

export const Radio: DropdownStory = RadioTemplate;

const NestedComponent = (args: RootProps) => {
  const [value, setValue] = useState('red');
  return (
    <div style={{ margin: '0 auto', minHeight: '420px', marginTop: '220px' }}>
      <Dropdown
        {...args}
        overlay={[
          <Dropdown.RadioGroup key="radio-group-1" value={value} onChange={setValue}>
            <Dropdown.Radio key="red-1" value="red">
              Red
            </Dropdown.Radio>
            <Dropdown.Radio key="blue-1" value="blue">
              Blue
            </Dropdown.Radio>
            <Dropdown.Radio key="green-1" value="green">
              Green
            </Dropdown.Radio>
          </Dropdown.RadioGroup>,
          <Dropdown
            key="nested-dropdown"
            isNested
            overlay={[
              <Dropdown.RadioGroup key="radio-group-2" value={value} onChange={setValue}>
                <Dropdown.Radio key="red-2" value="red">
                  Red
                </Dropdown.Radio>
                <Dropdown.Radio key="blue-2" value="blue">
                  Blue
                </Dropdown.Radio>
                <Dropdown.Radio key="green-2" value="green">
                  Green
                </Dropdown.Radio>
              </Dropdown.RadioGroup>,
            ]}
          >
            <Dropdown.TriggerItem>Open sub menu</Dropdown.TriggerItem>
          </Dropdown>,
          <Dropdown.Item key="hello">Hello</Dropdown.Item>,
        ]}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          Nested Menu
        </Button>
      </Dropdown>
    </div>
  );
};

const NestedTemplate: DropdownStory = { render: args => <NestedComponent {...args} /> };

export const Nested: DropdownStory = NestedTemplate;
