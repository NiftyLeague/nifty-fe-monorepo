import type { Meta, StoryObj } from '@storybook/react';
import Typography from '../Typography';
import { Card } from './';

const meta: Meta<typeof Card> = {
  title: 'Displays/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <Typography.Title level={5}>Card content</Typography.Title>
        <Typography.Title level={5}>Card content</Typography.Title>
        <Typography.Title level={5}>Card content</Typography.Title>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'I am a title',
    titleExtra: <Typography.Link>Learn more</Typography.Link>,
  },
};

export const WithCover: Story = {
  args: {
    cover: (
      <img
        className="h-64 w-full object-cover"
        src={'https://supabase.io/new/img/case-study-monitoro.jpg'}
        alt={'title'}
      />
    ),
    children: (
      <>
        <Typography.Text type="secondary">Sub title here</Typography.Text>
        <Typography.Title level={3}>To Do List with Vue.JS</Typography.Title>
      </>
    ),
  },
};

export const WithMeta: Story = {
  args: {
    title: 'title is here',
    children: <Card.Meta title={'To Do List with Vue.JS'} description={'To Do List with Vue.JS'} />,
  },
};

export const WithHover: Story = {
  args: {
    title: 'This card can hover',
    hoverable: true,
    children: <Card.Meta title={'To Do List with Vue.JS'} description={'To Do List with Vue.JS'} />,
  },
};
