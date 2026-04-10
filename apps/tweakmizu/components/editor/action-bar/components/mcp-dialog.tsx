interface MCPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MCPDialog({ open, onOpenChange: _onOpenChange }: MCPDialogProps) {
  if (!open) return null;
  // Placeholder for MCP dialog
  return null;
}
