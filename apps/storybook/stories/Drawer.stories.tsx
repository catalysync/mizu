import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Stack,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Overlays/Drawer',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>App settings</DrawerTitle>
          <DrawerDescription>Update your app configuration.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <Stack gap="1rem">
            <div>
              <span className="mizu-caption">App name</span>
              <Input defaultValue="frosty-mountain-1234" aria-label="App name" />
            </div>
            <div>
              <span className="mizu-caption">Region</span>
              <Input defaultValue="us-east" aria-label="Region" />
            </div>
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Left: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Open left</Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p style={{ margin: 0 }}>Sidebar content here.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};
