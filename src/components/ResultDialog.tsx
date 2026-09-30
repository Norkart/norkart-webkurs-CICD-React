import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

type ResultDialogProps = {
  open: boolean;
  score: number;
  deviation: number;
  targetHeight: number;
  bestAttempt: number;
  bestAttemptNumber: number;
  qualifies: boolean;
  saved: boolean;
  onSave: (name: string) => void;
  onNewGame: () => void;
};

export function ResultDialog({
  open,
  score,
  deviation,
  targetHeight,
  bestAttempt,
  bestAttemptNumber,
  qualifies,
  saved,
  onSave,
  onNewGame,
}: ResultDialogProps) {
  const [name, setName] = useState('');
  const title = resultTitle(score);

  const handleSave = () => {
    onSave(name.trim().slice(0, 20));
  };

  return (
    <Dialog
      open={open}
      onClose={onNewGame}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 5,
          background: 'linear-gradient(145deg, #ffffff 0%, #effcf9 100%)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3, color: '#073b5c', fontWeight: 900 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontSize: '3.4rem', fontWeight: 900, color: '#0f766e' }}>
            {Math.round(score)} poeng
          </Typography>
          <LinearProgress
            variant="determinate"
            value={score / 10}
            sx={{
              width: '100%',
              height: 12,
              borderRadius: 6,
              backgroundColor: '#d8f3ef',
              '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #f59e0b, #0f9f9a)' },
            }}
          />
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <ResultField label="Mål" value={`${targetHeight} moh.`} />
            <ResultField label={`Beste gjett ${bestAttemptNumber}`} value={`${bestAttempt.toFixed(1)} moh.`} />
            <ResultField label="Avvik" value={`${deviation.toFixed(1)} m`} />
          </Stack>
          <Typography sx={{ color: '#166534', fontWeight: 900 }}>
            🏆 Beste gjett: Forsøk {bestAttemptNumber}
          </Typography>
          {score >= 950 && <Typography sx={{ color: '#b45309', fontWeight: 800 }}>🎉 For en presisjon!</Typography>}
          {qualifies && !saved && (
            <Stack spacing={1.2} sx={{ width: '100%' }}>
              <Typography sx={{ color: '#0f766e', fontWeight: 800, textAlign: 'center' }}>
                🎉 Ny plassering på topplisten!
              </Typography>
              <TextField
                label="Navn (valgfritt)"
                value={name}
                onChange={(event) => setName(event.target.value.slice(0, 20))}
                helperText={`${name.length}/20 tegn`}
                size="small"
                fullWidth
              />
            </Stack>
          )}
          {saved && (
            <Typography sx={{ color: '#166534', fontWeight: 800 }}>
              Resultatet er lagret som {name.trim() || 'Anonym'}.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 1 }}>
        {qualifies && !saved && (
          <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 3, fontWeight: 800 }}>
            Lagre på topplisten
          </Button>
        )}
        <Button variant={qualifies && !saved ? 'outlined' : 'contained'} onClick={onNewGame} sx={{ borderRadius: 3 }}>
          Spill igjen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ResultField({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      alignItems="center"
      sx={{ flex: 1, p: 1, borderRadius: 2.5, backgroundColor: '#e8f7f5' }}
    >
      <Typography variant="caption" sx={{ color: '#39727b' }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: '#073b5c', fontWeight: 900, textAlign: 'center' }}>
        {value}
      </Typography>
    </Stack>
  );
}

function resultTitle(score: number) {
  if (score >= 950) return '🏆 Utrolig høydetreff!';
  if (score >= 800) return '🎯 Kjempebra treff!';
  if (score >= 500) return '⛰️ Godt forsøk!';
  return '🧭 Ny ekspedisjon?';
}
