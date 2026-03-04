'use client';
/* ═══════════════════════════════════════════════════════
   ShortcutsHelp — Keyboard shortcuts modal
   ═══════════════════════════════════════════════════════ */
import React from 'react';
import Modal from '../UI/Modal';

const shortcuts = [
  ['Ctrl+N', 'New Presentation'],
  ['Ctrl+S', 'Save'],
  ['Ctrl+O', 'Open File'],
  ['Ctrl+Z', 'Undo'],
  ['Ctrl+Y', 'Redo'],
  ['Ctrl+C', 'Copy'],
  ['Ctrl+V', 'Paste'],
  ['Ctrl+X', 'Cut'],
  ['Ctrl+D', 'Duplicate Element'],
  ['Ctrl+A', 'Select All'],
  ['Ctrl+F / H', 'Find & Replace'],
  ['Ctrl+G', 'Toggle Grid'],
  ['Ctrl+M', 'New Slide'],
  ['Ctrl+=', 'Zoom In'],
  ['Ctrl+−', 'Zoom Out'],
  ['Ctrl+0', 'Reset Zoom'],
  ['Delete', 'Delete Element'],
  ['Escape', 'Deselect / Close'],
  ['Arrow Keys', 'Nudge Element (1px / 20px with grid)'],
  ['F5', 'Start Presentation'],
  ['Shift+F5', 'Presenter View'],
  ['Ctrl+Shift+C', 'Format Painter'],
];

interface Props { open: boolean; onClose: () => void; }

export default function ShortcutsHelp({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts" width="420px">
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
        {shortcuts.map(([key, desc]) => (
          <React.Fragment key={key}>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded text-right"
              style={{ background: 'var(--bg-hover)', color: 'var(--accent)' }}>{key}</span>
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{desc}</span>
          </React.Fragment>
        ))}
      </div>
    </Modal>
  );
}
