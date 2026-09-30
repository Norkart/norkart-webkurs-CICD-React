import { useEffect, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

type IntroDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function IntroDialog({ open, onClose }: IntroDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="hoydetreff-intro-title"
      PaperProps={{
        sx: {
          borderRadius: 5,
          background: 'linear-gradient(145deg, #ffffff 0%, #effcf9 100%)',
        },
      }}
    >
      <DialogTitle
        id="hoydetreff-intro-title"
        sx={{ color: '#073b5c', fontWeight: 900, textAlign: 'center', pt: 3 }}
      >
        Velkommen til Høydetreff!
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1.2} alignItems="center" sx={{ textAlign: 'center' }}>
          <Typography sx={{ color: '#39727b' }}>
            Finn et sted i Norge som ligger nærmest målhøyden.
          </Typography>
          <Typography sx={{ color: '#075985', fontWeight: 800 }}>
            Du får tre forsøk, og ditt beste gjett teller.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          ref={closeButtonRef}
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: 3,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #075985, #0f9f9a)',
          }}
        >
          Start høydetreff
        </Button>
      </DialogActions>
    </Dialog>
  );
}
