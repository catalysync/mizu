import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Stack,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Overlays/Modal',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete app</ModalTitle>
          <ModalDescription>This action cannot be undone.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="mizu-body--sm">
            Are you sure you want to permanently delete <strong>frosty-mountain-1234</strong>?
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">Cancel</Button>
          </ModalClose>
          <Button variant="destructive">Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Edit settings</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>App settings</ModalTitle>
          <ModalDescription>Update your configuration.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <Stack gap="0.75rem">
            <div>
              <label className="mizu-label" htmlFor="modal-name">
                App name
              </label>
              <Input id="modal-name" defaultValue="frosty-mountain-1234" />
            </div>
            <div>
              <label className="mizu-label" htmlFor="modal-region">
                Region
              </label>
              <Input id="modal-region" defaultValue="us-east" />
            </div>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">Cancel</Button>
          </ModalClose>
          <Button variant="primary">Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Informational: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="secondary">View details</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Deploy v142</ModalTitle>
          <ModalDescription>Deployed 2 hours ago by alex</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <dl className="mizu-kv-pairs">
            <dt>Commit</dt>
            <dd className="mizu-mono">a3f8c21</dd>
            <dt>Branch</dt>
            <dd>main</dd>
            <dt>Duration</dt>
            <dd>48s</dd>
          </dl>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete your account</ModalTitle>
          <ModalDescription>All data will be permanently removed.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <Stack gap="0.75rem">
            <p className="mizu-body--sm">
              Type <strong>DELETE</strong> to confirm.
            </p>
            <Input placeholder="Type DELETE" aria-label="Confirmation" />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">Cancel</Button>
          </ModalClose>
          <Button variant="destructive">Delete permanently</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="ghost">Quick confirm</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Are you sure?</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">No</Button>
          </ModalClose>
          <Button variant="primary">Yes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};
