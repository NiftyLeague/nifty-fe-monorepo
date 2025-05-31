import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import Radio from '.';

const meta: Meta<typeof Radio.Group> = {
  title: 'Form/Radio',
  component: Radio.Group,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction of the radio group',
    },
    size: {
      control: 'select',
      options: ['tiny', 'small', 'medium', 'large', 'xlarge'],
      description: 'Size of the radio buttons',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selection changes',
    },
  },
  args: {
    // Default args for all stories
    name: 'radio-group',
    layout: 'vertical',
    size: 'medium',
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof Radio.Group>;

export default meta;
type Story = StoryObj<typeof meta>;

const radioOptions = [
  {
    label: 'Comments',
    description: 'Get notified when someone posts a comment.',
    value: '1',
  },
  {
    label: 'Candidates',
    description: 'Get notified when a candidate applies for a job.',
    value: '2',
  },
  {
    label: 'Offers',
    description: 'Get notified when a candidate accepts or rejects an offer.',
    value: '3',
    disabled: true,
  },
];

export const Default: Story = {
  args: {
    label: 'Notification Preferences',
    descriptionText: 'Choose how you want to be notified',
    options: radioOptions,
  },
  render: args => (
    <div style={{ width: '400px' }}>
      <Radio.Group {...args}>
        {args.options?.map(option => (
          <Radio
            key={option.value}
            name={args.name}
            label={option.label}
            description={option.description}
            value={option.value}
            disabled={option.disabled}
          />
        ))}
      </Radio.Group>
    </div>
  ),
};

export const HorizontalLayout: Story = {
  ...Default,
  args: {
    ...Default.args,
    layout: 'horizontal',
    label: 'Horizontal Radio Group',
  },
};

export const WithError: Story = {
  ...Default,
  args: {
    ...Default.args,
    error: 'Please select an option',
    label: 'Radio Group with Error',
  },
};

export const WithCustomLabels: Story = {
  args: {
    label: 'Pricing Plans',
    options: [
      {
        label: 'Unlimited',
        beforeLabel: 'Up to 5 team members',
        afterLabel: '$80/month',
        value: 'unlimited',
      },
      {
        label: 'Business',
        beforeLabel: 'Up to 3 team members',
        afterLabel: '$60/month',
        value: 'business',
      },
      {
        label: 'Basic',
        beforeLabel: 'Solo user',
        afterLabel: '$30/month',
        value: 'basic',
      },
    ],
  },
  render: args => (
    <div style={{ width: '500px' }}>
      <Radio.Group {...args}>
        {args.options?.map(option => (
          <div key={option.value} style={{ marginBottom: '1rem' }}>
            <Radio
              name={args.name}
              label={option.label}
              beforeLabel={option.beforeLabel}
              afterLabel={option.afterLabel}
              value={option.value}
            />
          </div>
        ))}
      </Radio.Group>
    </div>
  ),
};

export const DisabledState: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
    label: 'Disabled Radio Group',
  },
};
