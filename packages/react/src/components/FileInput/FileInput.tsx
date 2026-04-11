import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

export interface FileInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
> {
  onFilesChange?: (files: File[]) => void;
  maxSize?: number;
  maxFiles?: number;
  hint?: React.ReactNode;
  browseLabel?: React.ReactNode;
  dropLabel?: React.ReactNode;
  inputClassName?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      inputClassName,
      onFilesChange,
      multiple = false,
      accept,
      maxSize,
      maxFiles,
      hint,
      browseLabel = 'click to browse',
      dropLabel = 'Drop files here or',
      disabled,
      required,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      id: idProp,
      ...rest
    },
    forwardedRef,
  ) => {
    const ctx = useFieldContext();
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLInputElement);

    const [files, setFiles] = React.useState<File[]>([]);
    const [dragging, setDragging] = React.useState(false);
    const [localError, setLocalError] = React.useState<string | null>(null);

    const resolvedId = idProp ?? ctx?.controlId;
    const resolvedDisabled = disabled ?? ctx?.disabled ?? false;
    const resolvedRequired = required ?? ctx?.required ?? false;
    const resolvedInvalid = ariaInvalidProp ?? (localError != null || ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    const validate = (incoming: File[]): { files: File[]; error: string | null } => {
      let error: string | null = null;
      let next = incoming;
      if (!multiple && next.length > 1) next = next.slice(0, 1);
      if (maxFiles != null && next.length > maxFiles) {
        error = `Maximum ${maxFiles} files allowed`;
        next = next.slice(0, maxFiles);
      }
      if (maxSize != null) {
        const oversized = next.filter((f) => f.size > maxSize);
        if (oversized.length > 0) {
          error = `File exceeds maximum size of ${formatBytes(maxSize)}`;
          next = next.filter((f) => f.size <= maxSize);
        }
      }
      return { files: next, error };
    };

    const commit = (incoming: File[]) => {
      const { files: validated, error } = validate(incoming);
      setLocalError(error);
      setFiles(validated);
      onFilesChange?.(validated);
    };

    const handleNative = (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (!list) return;
      commit(Array.from(list));
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragging(false);
      if (resolvedDisabled) return;
      const incoming = Array.from(e.dataTransfer.files ?? []);
      if (incoming.length > 0) commit(incoming);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      if (!resolvedDisabled) setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
      setDragging(false);
    };

    const removeAt = (index: number) => {
      const next = files.filter((_, i) => i !== index);
      setFiles(next);
      setLocalError(null);
      onFilesChange?.(next);
    };

    return (
      <div
        className={cn('mizu-file-input', className)}
        data-component="mizu-file-input"
        data-dragging={dragging || undefined}
        data-invalid={resolvedInvalid || undefined}
        data-disabled={resolvedDisabled || undefined}
      >
        <label
          htmlFor={resolvedId}
          className="mizu-file-input__dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <span className="mizu-file-input__icon" aria-hidden="true">
            ⬆
          </span>
          <span className="mizu-file-input__primary">
            {dropLabel} <span className="mizu-file-input__browse">{browseLabel}</span>
          </span>
          {hint != null ? <span className="mizu-file-input__hint">{hint}</span> : null}
          <input
            {...rest}
            ref={innerRef}
            id={resolvedId}
            type="file"
            className={cn('mizu-file-input__native', inputClassName)}
            multiple={multiple}
            accept={accept}
            onChange={handleNative}
            required={resolvedRequired}
            disabled={resolvedDisabled}
            aria-invalid={resolvedInvalid}
            aria-describedby={resolvedDescribedBy}
          />
        </label>
        {localError ? (
          <p className="mizu-field__info mizu-field__error" role="alert">
            {localError}
          </p>
        ) : null}
        {files.length > 0 ? (
          <ul className="mizu-file-input__list">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="mizu-file-input__file">
                <span className="mizu-file-input__file-name">{file.name}</span>
                <span className="mizu-file-input__file-size">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  className="mizu-file-input__remove"
                  onClick={() => removeAt(index)}
                  aria-label={`Remove ${file.name}`}
                  disabled={resolvedDisabled}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
);
FileInput.displayName = 'FileInput';
