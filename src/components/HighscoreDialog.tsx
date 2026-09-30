import { useEffect, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import type { HighscoreEntry } from './GamePanel';

type HighscoreDialogProps = {
  open: boolean;
  entries: HighscoreEntry[];
  onClose: () => void;
  onReset: () => void;
  highlightedEntryDate?: string;
};

export function HighscoreDialog({
  open,
  entries,
  onClose,
  onReset,
  highlightedEntryDate,
}: HighscoreDialogProps) {
  const highlightedRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && highlightedEntryDate) {
      highlightedRowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [open, highlightedEntryDate]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ color: '#073b5c', fontWeight: 900 }}>🏆 Toppliste</DialogTitle>
      <DialogContent sx={{ maxHeight: 'min(60vh, 520px)', overflowY: 'auto' }}>
        <Stack spacing={1}>
          {entries.length === 0 && (
            <Typography color="text.secondary">Ingen resultater ennå. Bli den første!</Typography>
          )}
          {entries.map((entry, index) => {
            const isHighlighted = entry.date === highlightedEntryDate;
            return (
            <Stack
              key={`${entry.date}-${index}`}
              ref={isHighlighted ? highlightedRowRef : undefined}
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                p: 1,
                borderRadius: 2.5,
                backgroundColor: isHighlighted ? '#dcfce7' : 'transparent',
                border: isHighlighted ? '2px solid #16a34a' : '2px solid transparent',
                boxShadow: isHighlighted ? '0 0 0 3px rgba(22, 163, 74, 0.14)' : 'none',
              }}
            >
              <Typography sx={{ width: 34, fontSize: '1.25rem', fontWeight: 900 }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
              </Typography>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ color: '#073b5c', fontWeight: 800 }}>
                  {entry.name || 'Anonym'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {entry.deviation.toFixed(1)} m avvik
                  {entry.bestAttempt ? ` · forsøk ${entry.bestAttempt}` : ''} ·{' '}
                  {formatDate(entry.date)}
                </Typography>
              </Stack>
              <Typography sx={{ color: '#0f766e', fontWeight: 900, whiteSpace: 'nowrap' }}>
                {Math.round(entry.score)} poeng
              </Typography>
            </Stack>
            );
          })}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
        <Button color="inherit" size="small" onClick={onReset}>Nullstill toppliste</Button>
        <Button variant="contained" onClick={onClose} sx={{ borderRadius: 3 }}>Lukk</Button>
      </DialogActions>
    </Dialog>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('nb-NO', { dateStyle: 'short' }).format(new Date(date));
}
