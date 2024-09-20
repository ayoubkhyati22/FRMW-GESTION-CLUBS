import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Divider, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';


// ----------------------------------------------------------------------

export default function UserCreate() {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");

  const [name, setName] = useState("");
  const [ville, setVille] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isEnabledButton, setEnabledButton] = useState(false);


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Nouveau athlète</Typography>
      </Stack>
      <Card sx={{
        margin: 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        Création d`un nouveau athlète.
        <br />
        <form sx >

          {/* Divider */}
          <Grid item xs={12}>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {'Club'}
              </Typography>
            </Divider>
          </Grid>

          <Grid container spacing={3}>
            {/* Left side fields */}
            <Grid item xs={12} md={6}>
              <TextField fullWidth name="name" label="KSCT" disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth name="adresse" label="90 AINSEBAA RUE DES SOPHORAS" disabled />
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {'Informations athlète'}
                </Typography>
              </Divider>
            </Grid>

            {/* Right side fields */}
            <Grid item xs={12} md={6}>
              <TextField fullWidth name="id_frmw" label="Numéro de passeport sportif" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth name="dateNaissance" label="Date de naissance (jj/mm/yyyy)" required />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth name="nom" label="Nom de famille" onChange={(e) => setNom(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth name="prenom" label="Prénom" onChange={(e) => setPrenom(e.target.value)} required />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth name="telephone" label="Numéro de téléphone" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth name="grade" label="Couleur de la ceinture (grade)" required />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {'Compte'}
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth name="email" label="Adresse mail" onChange={(e) => setEmailRegister(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="password"
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPasswordRegister(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="outlined"
                color="secondary"
              >
                Génerer
              </LoadingButton>
            </Grid>
          </Grid>

          <br />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
          >
            Ajouter l'athlète
          </LoadingButton>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            {isLoading && <span class="loader" ></span>}
          </Box>


        </form>
      </Card>

    </Container>
  );
}
