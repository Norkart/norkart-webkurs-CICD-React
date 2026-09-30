import { Button, Paper, Stack, Typography } from '@mui/material';
import type { Attempt } from './GamePanel';

type MiniGameHudProps = {
  targetHeight: number;
  attempts: Attempt[];
  bestAttemptIndex: number;
  terrainEnabled: boolean;
  onOpenPanel: () => void;
  onToggleTerrain: () => void;
};

export function MiniGameHud({
  targetHeight,
  attempts,
  bestAttemptIndex,
  terrainEnabled,
  onOpenPanel,
  onToggleTerrain,
}: MiniGameHudProps) {
  const currentAttempt = Math.min(attempts.length + 1, 3);

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: 'calc(100vw - 24px)', sm: 340 },
        maxWidth: 340,
        p: 1.5,
        borderRadius: 5,
        color: 'white',
        border: '1px solid rgba(186, 230, 253, 0.4)',
        background: 'linear-gradient(145deg, rgba(7, 59, 92, 0.94), rgba(15, 118, 110, 0.9))',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 12px 30px rgba(8, 47, 73, 0.36)',
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
            🗻 Høydetreff
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1.1 }}>
          🎯 {targetHeight} moh.
        </Typography>
        <Stack direction="row" spacing={0.7} alignItems="center">
          {[0, 1, 2].map((index) => {
            const completed = attempts[index] !== undefined;
            const isBest = bestAttemptIndex === index;
            const isActive = !completed && attempts.length < 3 && currentAttempt === index + 1;
            return (
              <Stack
                key={index}
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  fontWeight: 900,
                  fontSize: 13,
                  color: completed || isActive ? '#073b5c' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isBest ? '#86efac' : isActive ? '#67e8f9' : completed ? '#bae6fd' : 'rgba(255,255,255,0.16)',
                  boxShadow: isActive ? '0 0 0 3px rgba(251,191,36,0.28)' : undefined,
                }}
              >
                {isBest ? '★' : index + 1}
              </Stack>
            );
          })}
          <Typography variant="caption" sx={{ ml: 0.4, color: 'rgba(255,255,255,0.78)' }}>
            Forsøk {currentAttempt} av 3
          </Typography>
        </Stack>
        {attempts.length > 0 && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.82)' }}>
            Forrige gjett: {attempts[attempts.length - 1].height.toFixed(1)} moh.
          </Typography>
        )}
        <Button
          fullWidth
          size="small"
          onClick={onToggleTerrain}
          aria-label={terrainEnabled ? 'Slå av 3D-terreng' : 'Slå på 3D-terreng'}
          sx={quickButtonSx(terrainEnabled)}
        >
          ⛰️ {terrainEnabled ? '3D terreng på' : '3D terreng'}
        </Button>
        <Button
          fullWidth
          size="small"
          onClick={onOpenPanel}
          aria-label="Åpne spillpanel"
          sx={panelToggleButtonSx}
        >
          ↓ Åpne spillpanel
        </Button>
      </Stack>
    </Paper>
  );
}

const quickButtonSx = (active: boolean) => ({
  minWidth: 0,
  color: 'white',
  borderRadius: 2.5,
  border: '1px solid rgba(255,255,255,0.35)',
  backgroundColor: active ? 'rgba(134, 239, 172, 0.26)' : 'rgba(255,255,255,0.1)',
  fontWeight: 900,
  '&:hover, &:focus-visible': { backgroundColor: 'rgba(255,255,255,0.22)' },
});

const panelToggleButtonSx = {
  width: '100%',
  minHeight: 36,
  borderRadius: 3,
  color: 'white',
  fontWeight: 700,
  '&:hover, &:focus-visible': {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
};
