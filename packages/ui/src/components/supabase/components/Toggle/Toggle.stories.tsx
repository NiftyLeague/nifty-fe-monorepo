/* eslint-disable @typescript-eslint/no-explicit-any */

import { Toggle } from '.';

export default { title: 'Data Input/Toggle', component: Toggle, argTypes: { label: { control: 'text' } } };

export const Primary = (args: any) => <Toggle {...args} />;
export const checkedDefault = (args: any) => <Toggle {...args} />;
export const noLabel = (args: any) => <Toggle {...args} />;
export const withBeforeAndAfterLabel = (args: any) => <Toggle {...args} />;
export const size = (args: any) => <Toggle {...args} />;

Primary.args = {
  descriptionText: 'This is optional description',
  disabled: false,
  error: '',
  label: "Get insights across your organization's repositories",
  labelOptional: 'Star history, issue tracking, and more to come repository.surf organization',
  name: 'radiogroup-example',
  layout: 'horizontal',
};

checkedDefault.args = {
  defaultChecked: true,
  descriptionText: 'This is optional description',
  label: 'Radio group main label',
  labelOptional: 'This is an optional label',
};

noLabel.args = { active: true, disabled: false, error: '', name: 'radiogroup-example', layout: 'horizontal' };

withBeforeAndAfterLabel.args = { label: 'Label', beforeLabel: 'Before : ', afterLabel: ' : After' };

size.args = { label: 'Try different sizes', size: 'xs' };
