import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { FileInput } from './FileInput';
import { Field } from '../Field';

function makeFile(name: string, size = 1024, type = 'text/plain') {
  const file = new File(['x'.repeat(size)], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('FileInput', () => {
  it('renders a dropzone with a labelled file input', () => {
    render(
      <Field label="Upload receipt">
        <FileInput />
      </Field>,
    );
    const input = screen.getByLabelText(/Upload receipt/);
    expect((input as HTMLInputElement).type).toBe('file');
  });

  it('emits files when the user picks a file', () => {
    const onFilesChange = vi.fn();
    const { container } = render(<FileInput aria-label="Upload" onFilesChange={onFilesChange} />);
    const native = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile('receipt.pdf', 2048);
    fireEvent.change(native, { target: { files: [file] } });
    expect(onFilesChange).toHaveBeenCalledWith([file]);
    expect(screen.getByText('receipt.pdf')).toBeInTheDocument();
  });

  it('enforces maxSize and shows an error', () => {
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileInput aria-label="Upload" maxSize={1000} onFilesChange={onFilesChange} />,
    );
    const native = container.querySelector('input[type="file"]') as HTMLInputElement;
    const big = makeFile('big.pdf', 5000);
    fireEvent.change(native, { target: { files: [big] } });
    expect(onFilesChange).toHaveBeenCalledWith([]);
    expect(screen.getByRole('alert')).toHaveTextContent(/exceeds/i);
  });

  it('enforces maxFiles', () => {
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileInput aria-label="Upload" multiple maxFiles={2} onFilesChange={onFilesChange} />,
    );
    const native = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [makeFile('a.txt', 10), makeFile('b.txt', 10), makeFile('c.txt', 10)];
    fireEvent.change(native, { target: { files } });
    expect(onFilesChange).toHaveBeenLastCalledWith(files.slice(0, 2));
    expect(screen.getByRole('alert')).toHaveTextContent(/Maximum 2 files/);
  });

  it('limits to one file when not multiple', () => {
    const onFilesChange = vi.fn();
    const { container } = render(<FileInput aria-label="Upload" onFilesChange={onFilesChange} />);
    const native = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [makeFile('a.txt'), makeFile('b.txt')];
    fireEvent.change(native, { target: { files } });
    expect(onFilesChange).toHaveBeenLastCalledWith([files[0]]);
  });

  it('removes a file when the × button is clicked', () => {
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileInput aria-label="Upload" multiple onFilesChange={onFilesChange} />,
    );
    const native = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(native, {
      target: { files: [makeFile('a.txt'), makeFile('b.txt')] },
    });
    const removeButtons = screen.getAllByRole('button', { name: /Remove/ });
    fireEvent.click(removeButtons[0]);
    expect(onFilesChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'b.txt' })]);
  });

  it('reads required + disabled from Field context', () => {
    const { container } = render(
      <Field label="Attachment" required disabled>
        <FileInput />
      </Field>,
    );
    const native = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(native.required).toBe(true);
    expect(native.disabled).toBe(true);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field label="Attachment" description="PDF up to 5 MB">
        <FileInput accept="application/pdf" maxSize={5 * 1024 * 1024} />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
