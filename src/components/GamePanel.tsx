import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

export type Attempt = {
  height: number;
  deviation?: number;
};

export type HighscoreEntry = {
  name: string;
  score: number;
  deviation: number;
  targetHeight: number;
  date: string;
  bestAttempt?: number;
};

type GamePanelProps = {
  targetHeight: number;
  attempts: Attempt[];
  isLoading: boolean;
  error: string | null;
  score?: number;
  deviation?: number;
  onNewGame: () => void;
  onOpenHighscores: () => void;
  onOpenIntro: () => void;
  terrainEnabled: boolean;
  onToggleTerrain: () => void;
  onHidePanel: () => void;
  bestAttemptIndex?: number;
};

export function GamePanel({
  targetHeight,
  attempts,
  isLoading,
  error,
  score,
  deviation,
  onNewGame,
  onOpenHighscores,
  onOpenIntro,
  terrainEnabled,
  onToggleTerrain,
  onHidePanel,
  bestAttemptIndex,
}: GamePanelProps) {
  return (
    <Card
      elevation={0}
      sx={{
        width: { xs: 'calc(100vw - 32px)', sm: 360 },
        maxWidth: { xs: 'calc(100vw - 32px)', sm: 360 },
        maxHeight: { xs: '40dvh', sm: 'none' },
        borderRadius: 5,
        overflowY: { xs: 'auto', sm: 'hidden' },
        boxShadow: '0 18px 45px rgba(8, 47, 73, 0.28)',
        background: 'linear-gradient(145deg, #ffffff 0%, #f0fbfa 100%)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: 3 } }}>
        <Stack spacing={{ xs: 1.5, sm: 1.35 }}>
          <Box
            aria-hidden="true"
            sx={{
              display: { xs: 'block', sm: 'none' },
              width: 42,
              height: 4,
              mx: 'auto',
              borderRadius: 2,
              backgroundColor: 'rgba(7, 59, 92, 0.2)',
            }}
          />
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <div>
              <Typography
                variant="h4"
                component="h2"
                sx={{ color: '#073b5c', fontWeight: 900, letterSpacing: '-0.04em' }}
              >
                Høydetreff 🗻
              </Typography>
              <Typography variant="body2" sx={{ color: '#39727b', mt: 0.5 }}>
                Finn et sted i Norge som ligger nærmest målhøyden.
              </Typography>
            </div>
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Hjelp">
                <IconButton onClick={onOpenIntro} aria-label="Åpne hjelp">
                  ?
                </IconButton>
              </Tooltip>
              <Tooltip title="Toppliste">
                <IconButton
                  onClick={onOpenHighscores}
                  aria-label="Åpne toppliste"
                  sx={{
                    color: '#f59e0b',
                    backgroundColor: '#fff7d6',
                    '&:hover': { backgroundColor: '#ffefae' },
                  }}
                >
                  🏆
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              minHeight: 128,
              borderRadius: 4,
              color: 'white',
              background: 'linear-gradient(135deg, #075985 0%, #0f9f9a 100%)',
              boxShadow: 'inset 0 -10px 30px rgba(3, 53, 74, 0.2)',
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>
              MÅLHØYDE
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontWeight: 900, fontSize: { xs: '2.8rem', sm: '3.2rem' } }}
            >
              🎯 {targetHeight}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              meter over havet
            </Typography>
          </Stack>

          <Alert
            severity="info"
            icon="🧭"
            sx={{
              borderRadius: 3,
              color: '#075985',
              backgroundColor: '#e0f7f5',
              '& .MuiAlert-icon': { color: '#0f766e' },
            }}
          >
            <strong>Du har tre forsøk.</strong> Ditt beste gjett teller.
          </Alert>

          <Stack direction="row" spacing={1}>
            {[0, 1, 2].map((index) => {
              const attempt = attempts[index];
              const attemptDeviation =
                attempt === undefined
                  ? undefined
                  : Math.abs(attempt.height - targetHeight);
              const color = attemptColor(attemptDeviation);
              const isBest = bestAttemptIndex === index;
              const isActive = attempts.length < 3 && attempts.length === index;

              return (
                <Stack
                  key={index}
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    flex: 1,
                    minHeight: 82,
                    p: 1,
                    borderRadius: 3,
                    border: `2px solid ${isBest ? '#16a34a' : isActive ? '#0891b2' : color.border}`,
                    backgroundColor: attempt ? color.background : '#edf4f5',
                    color: isBest ? '#166534' : isActive ? '#075985' : attempt ? color.text : '#78909c',
                    opacity: attempt ? 1 : 0.72,
                    boxShadow: isBest
                      ? '0 0 0 3px rgba(34, 197, 94, 0.18)'
                      : isActive
                        ? '0 0 0 3px rgba(8, 145, 178, 0.16)'
                        : undefined,
                    animation: attempt && index === attempts.length - 1
                      ? 'guess-confirmation 420ms ease-out'
                      : undefined,
                    '@keyframes guess-confirmation': {
                      '0%': { transform: 'scale(0.96)', filter: 'brightness(1.12)' },
                      '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 900 }}>
                    {isBest ? '🏆 Beste hittil' : `Forsøk ${index + 1}`}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                    {attempt ? `${attempt.height.toFixed(1)}` : '–'}
                  </Typography>
                  <Typography variant="caption">
                    {attempt
                      ? `${attemptDeviation?.toFixed(1)} m avvik`
                      : 'Ikke brukt'}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>

          <Typography variant="caption" sx={{ color: '#52727a', textAlign: 'center' }}>
            Klikk i kartet for å gjette. Røde sirkler viser områder som er sperret.
          </Typography>

          <Button
            variant={terrainEnabled ? 'contained' : 'outlined'}
            onClick={onToggleTerrain}
            sx={{
              borderRadius: 3,
              fontWeight: 800,
              color: terrainEnabled ? 'white' : '#075985',
              borderColor: '#0f9f9a',
              background: terrainEnabled
                ? 'linear-gradient(90deg, #075985, #0f9f9a)'
                : 'transparent',
              '&:hover': {
                borderColor: '#075985',
                background: terrainEnabled ? 'linear-gradient(90deg, #075985, #0f766e)' : '#e0f7f5',
              },
            }}
          >
            {terrainEnabled ? '🌄 3D terreng på' : '🌄 3D terreng'}
          </Button>
          {isLoading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} sx={{ color: '#0f9f9a' }} />
              <Typography variant="body2">Henter høyde …</Typography>
            </Stack>
          )}
          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

          {score !== undefined && deviation !== undefined && (
            <Stack spacing={0.5} sx={{ p: 1.5, borderRadius: 3, backgroundColor: '#fff4cf' }}>
              <Typography sx={{ color: '#92400e', fontWeight: 800 }}>
                Beste gjett: {deviation.toFixed(1)} m avvik
              </Typography>
              <LinearProgress
                variant="determinate"
                value={score / 10}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: '#fde68a',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#f59e0b' },
                }}
              />
            </Stack>
          )}

          <Button
            variant="contained"
            onClick={onNewGame}
            sx={{
              borderRadius: 3,
              py: 1.15,
              fontWeight: 800,
              background: 'linear-gradient(90deg, #0f766e, #0f9f9a)',
              '&:hover': { background: 'linear-gradient(90deg, #115e59, #0f766e)' },
            }}
          >
            ✨ Nytt spill
          </Button>
          <Divider />
          <Button
            variant="text"
            onClick={onHidePanel}
            aria-label="Minimer spillpanel"
            sx={panelToggleButtonSx}
          >
            ↑ Minimer
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

const panelToggleButtonSx = {
  width: '100%',
  minHeight: 36,
  borderRadius: 3,
  color: '#39727b',
  fontWeight: 700,
  '&:hover, &:focus-visible': {
    backgroundColor: '#e0f7f5',
  },
};

function attemptColor(deviation?: number) {
  if (deviation === undefined) {
    return { background: '#edf4f5', border: '#c6d9dc', text: '#78909c' };
  }
  if (deviation <= 50) {
    return { background: '#dcfce7', border: '#22c55e', text: '#166534' };
  }
  if (deviation <= 250) {
    return { background: '#fef3c7', border: '#f59e0b', text: '#92400e' };
  }
  return { background: '#fee2e2', border: '#ef4444', text: '#991b1b' };
}
