import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '.';

type CheckboxStory = StoryObj<typeof Checkbox> & {
  args?: {
    options?: Array<{
      id: string;
      name: string;
      label: string;
      description: string;
      size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
    }>;
  };
};

const meta: Meta<typeof Checkbox> = {
  title: 'Data Input/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'This is the label',
    description: 'This is the description',
  },
};

export default meta;

const checkboxItems = [
  {
    id: 'checkbox1',
    name: 'languages',
    label: 'JavaScript',
    description:
      'JavaScript, often abbreviated as JS, is a programming language that conforms to the ECMAScript specification.',
  },
  {
    id: 'checkbox2',
    name: 'languages',
    label: 'TypeScript',
    description: 'TypeScript is a programming language developed and maintained by Microsoft.',
  },
  {
    id: 'checkbox3',
    name: 'languages',
    label: 'React',
    description: 'A JavaScript library for building user interfaces.',
  },
];

export const Default: CheckboxStory = {
  args: {
    label: 'Single Checkbox',
    description: 'This is a single checkbox',
  },
};

export const WithGroup: CheckboxStory = {
  render: args => (
    <Checkbox.Group {...args} name="languages" options={checkboxItems} layout="vertical">
      {checkboxItems.map(item => (
        <Checkbox
          key={item.id}
          id={item.id}
          name={item.name}
          label={item.label}
          description={item.description}
          value={item.id}
        />
      ))}
    </Checkbox.Group>
  ),
  args: {
    label: 'Checkbox Group',
    description: 'A group of checkboxes',
  },
};

export const WithGroupHorizontal: CheckboxStory = {
  ...WithGroup,
  args: {
    ...WithGroup.args,
    label: 'Horizontal Checkbox Group',
    description: 'Checkboxes in a horizontal layout',
  },
  render: args => (
    <Checkbox.Group {...args} name="languages-horizontal" options={checkboxItems} layout="horizontal">
      {checkboxItems.map(item => (
        <Checkbox key={item.id} id={`${item.id}-h`} name={item.name} label={item.label} value={item.id} />
      ))}
    </Checkbox.Group>
  ),
};

export const DifferentSizes: CheckboxStory = {
  render: args => (
    <div className="flex flex-col gap-4">
      {checkboxItems.map((item, index) => (
        <div key={item.id}>
          <Checkbox
            id={`${item.id}-size`}
            name="sizes"
            label={`${item.label} (${['tiny', 'small', 'medium'][index]})`}
            size={['tiny', 'small', 'medium'][index] as any}
          />
        </div>
      ))}
    </div>
  ),
  args: {
    label: 'Different Sizes',
    description: 'Checkboxes in different sizes',
  },
};

export const WithBeforeAndAfterLabels: CheckboxStory = {
  render: args => (
    <Checkbox.Group {...args} name="before-after" options={checkboxItems} layout="vertical">
      {checkboxItems.map(item => (
        <Checkbox
          key={item.id}
          id={`${item.id}-ba`}
          name="before-after"
          label={item.label}
          beforeLabel="Before: "
          afterLabel=" (after)"
          value={item.id}
        />
      ))}
    </Checkbox.Group>
  ),
  args: {
    label: 'With Before/After Labels',
    description: 'Checkboxes with custom labels',
  },
};
