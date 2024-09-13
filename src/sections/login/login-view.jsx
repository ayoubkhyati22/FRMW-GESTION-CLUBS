import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

//import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { Grid } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from 'src/firebase';
import { setDoc, doc } from "firebase/firestore";
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  //const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [name, setName] = useState("");
  const [ville, setVille] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState(""); 

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try{
      await createUserWithEmailAndPassword(auth,emailRegister,passwordRegister);
      const user = auth.currentUser;
      if(user){
        await setDoc(doc(db, "Users", user.uid),{
          email:user.email,
          name: name,
          ville: ville,
          adresse: adresse,
          telephone: telephone
        });
        setIsLoading(false);     
        toast.success("Le club "+name+" a été enregistrer.");
      }    
    }catch(error){
      setIsLoading(false);
      setEnabledButton(true);
      toast.error(error.message)
    }
  }

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Adresse mail" />

        <TextField
          name="password"
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Mot de passe oublié?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        //onClick={handleClick}
      >
        Se connecter
      </LoadingButton>
    </>
  );

  const renderFormRegister = (
  <form onSubmit={handleRegister}>

      <Grid container spacing={3}>
        {/* Left side fields */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="name" label="Nom du club" onChange={(e)=>setName(e.target.value)} required/>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="ville" label="Ville" onChange={(e)=>setVille(e.target.value)} required/>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField fullWidth name="adresse" label="Adresse du club" onChange={(e)=>setAdresse(e.target.value)} required/>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField fullWidth name="telephone" label="Numéro de téléphone" onChange={(e)=>setTelephone(e.target.value)} required />
        </Grid>
  
        {/* Divider */}
        <Grid item xs={12}>
          <Divider sx={{ my: 3 }} />
        </Grid>
  
        {/* Right side fields */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="email" label="Adresse mail" onChange={(e)=>setEmailRegister(e.target.value)} required/>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="password"
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            onChange={(e)=>setPasswordRegister(e.target.value)}
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
      </Grid>
      
  <br />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
      >
        Demande d'inscription
      </LoadingButton>
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
    }}>
      {isLoading && <span class="loader" ></span>}
    </Box>
  
      
  </form>
  );
  

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,

      }}
    >
      <img src="public\assets\frmwLOGO.png" alt="" width='240px' style={{marginLeft:20, marginTop:20}} />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 560,
          }}
        >
          <Typography variant="h4">Authentification (inscription)</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
          Vous n’avez pas de compte ?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Demander
            </Link>
          </Typography>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Votre compte
            </Typography>
          </Divider>

          {renderFormRegister}
        </Card>
      </Stack>
    </Box>
  );
}
