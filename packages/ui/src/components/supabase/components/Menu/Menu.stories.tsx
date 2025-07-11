/* eslint-disable @typescript-eslint/no-explicit-any */

import { Divider } from '../Divider';
import Icon from '@nl/ui/base/Icon';
import Typography from '../Typography';

import { Menu } from './';

export default { title: 'Navigation/Menu', component: Menu };

export const Default = (args: any) => (
  <Menu {...args}>
    <Menu.Item icon={<Icon name="mail" />}>Account settings</Menu.Item>
    <Divider />
    <Menu.Item icon={<Icon name="mail" />}>Account settings</Menu.Item>
    <Menu.Item icon={<Icon name="mail" />}>Account settings</Menu.Item>
  </Menu>
);

export const withActiveState = (args: any) => (
  <Menu {...args}>
    <Menu.Item icon={<Icon name="mail" />}>Account settings</Menu.Item>
    <Divider />
    <Menu.Item active icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
    <Menu.Item icon={<Icon name="mail" />}>Account settings</Menu.Item>
  </Menu>
);

export const withRounded = (args: any) => (
  <Menu {...args}>
    <Menu.Item rounded icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
    <Divider />
    <Menu.Item rounded active icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
    <Menu.Item rounded icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
  </Menu>
);

export const withGroupTitles = () => (
  <Menu>
    <Menu.Group title="First group" />
    <Menu.Item rounded icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
    <Menu.Item rounded icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
    <Menu.Item rounded icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
    <Menu.Group title="Second group" />
    <Menu.Item rounded icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
    <Menu.Item rounded icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
  </Menu>
);

export const withActiveBar = () => (
  <Menu>
    <Menu.Group title="First group" />
    <Menu.Item icon={<Icon name="mail" />}>Account settings</Menu.Item>
    <Menu.Item active showActiveBar icon={<Icon name="mail" />}>
      Account settings
    </Menu.Item>
    <Menu.Item icon={<Icon name="mail" />}>Account settings</Menu.Item>
    <Menu.Group title="Second group" />
    <Menu.Item icon={<Icon name="mail" />}>Account settings</Menu.Item>
    <Menu.Item icon={<Icon name="mail" />}>Account settings</Menu.Item>
  </Menu>
);

Default.args = { title: 'I am a title', titleExtra: <Typography.Link>Learn more</Typography.Link> };

withActiveState.args = { title: 'I am a title', titleExtra: <Typography.Link>Learn more</Typography.Link> };

withRounded.args = { title: 'I am a title', titleExtra: <Typography.Link>Learn more</Typography.Link> };
