import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  FadeIn,
  Grid,
  SlideIn,
  StaggeredEntrance,
  ZoomIn,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Motion',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fade: Story = {
  render: () => (
    <FadeIn>
      <Card className="story-md">
        <CardHeader title="Fade in" description="Default entrance animation." />
      </Card>
    </FadeIn>
  ),
};

export const FadeUp: Story = {
  render: () => (
    <FadeIn direction="up">
      <Card className="story-md">
        <CardHeader title="Fade in up" description="Slides up while fading." />
      </Card>
    </FadeIn>
  ),
};

export const Slide: Story = {
  render: () => (
    <SlideIn from="right">
      <Card className="story-md">
        <CardHeader title="Slide in" description="From the right." />
      </Card>
    </SlideIn>
  ),
};

export const Zoom: Story = {
  render: () => (
    <ZoomIn>
      <Card className="story-md">
        <CardHeader title="Zoom in" description="Scales up from 95%." />
      </Card>
    </ZoomIn>
  ),
};

export const Staggered: Story = {
  render: () => (
    <StaggeredEntrance stagger={80}>
      <Card>
        <CardHeader title="First" />
        <CardBody>
          <Badge tone="success">Active</Badge>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Second" />
        <CardBody>
          <Badge tone="warning">Pending</Badge>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Third" />
        <CardBody>
          <Badge tone="info">New</Badge>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Fourth" />
        <CardBody>
          <Badge tone="neutral">Draft</Badge>
        </CardBody>
      </Card>
    </StaggeredEntrance>
  ),
};

export const StaggeredGrid: Story = {
  render: () => (
    <Grid gap="1rem" min="12rem">
      <StaggeredEntrance stagger={60}>
        {['Revenue', 'Users', 'Orders', 'Uptime', 'Latency', 'Errors'].map((label) => (
          <Card key={label}>
            <CardHeader title={label} description="Loading..." />
          </Card>
        ))}
      </StaggeredEntrance>
    </Grid>
  ),
};
