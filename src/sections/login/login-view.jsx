import { useState, useEffect  } from 'react';

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
import { bgGradient } from 'src/theme/css';
import Iconify from 'src/components/iconify';
import { Grid } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from 'src/firebase';
import { setDoc, doc,addDoc, collection } from "firebase/firestore";
import { toast } from 'react-toastify';
import villesData from '../../utils/villes.json'


// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const [villes, setVilles] = useState([]);
  const [selectedVille, setSelectedVille] = useState("");

  useEffect(() => {
    setVilles(villesData.villes);
    console.log(villesData.villes); 
  }, []);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setIsLoading(true);
    try{
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href ="/";
      setIsLoading(false);     
      toast.success("Bienvenu.");
    }catch(error){
      setIsLoading(false);
      toast.error(error.message)
    }
  }
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Créer un utilisateur avec email et mot de passe
      await createUserWithEmailAndPassword(auth, emailRegister, passwordRegister);
      const user = auth.currentUser;
  
      if (user) {
        // Ajouter un club à Firestore sans spécifier d'ID (l'ID sera généré automatiquement)
        const clubRef = await addDoc(collection(db, "Clubs"), {
          name: name,
          ville: selectedVille,
          adresse: adresse,
        });
  
        // Récupérer l'ID du club ajouté
        const clubId = clubRef.id;
  
        // Ajouter l'utilisateur avec le rôle d'entraîneur et associer l'ID du club
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          nom: nom,
          prenom: prenom,
          telephone: telephone,
          role: "Entraineur",
          birthday: null,
          grade: "black",
          id_frmw: null,
          id_club: clubId, // Associer l'ID du club ici
        });
  
        setIsLoading(false);
        toast.success("Le club " + name + " a été enregistré.");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const renderForm = (
    <>
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField name="email" label="Adresse mail" onChange={(e)=>setEmail(e.target.value)} required/>

        <TextField
          name="password"
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          onChange={(e)=>setPassword(e.target.value)} 
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
      <br />
      <Box sx={{
      display: 'flex',
      justifyContent: 'center',
    }}>
      {isLoading && <span class="loader" ></span>}
    </Box>

    </form>
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
          <TextField
            fullWidth
            select
            name="ville"
            //label="Ville"
            value={selectedVille}
            onChange={(e) => setSelectedVille(e.target.value)}
            SelectProps={{
              native: true,
            }}
            required
          >
            <option value="">Sélectionnez une ville</option>
            {villes.map((ville, index) => (
              <option key={index} value={ville}>
                {ville}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField fullWidth name="adresse" label="Adresse du club" onChange={(e)=>setAdresse(e.target.value)} required/>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField fullWidth name="telephone" label="Numéro de téléphone" onChange={(e)=>setTelephone(e.target.value)} required />
        </Grid>
  
        {/* Divider */}
        <Grid item xs={12}>
        <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {'Entraineur principale du club'}
            </Typography>
          </Divider>
        </Grid>
  
        {/* Right side fields */}
        <Grid item xs={12} md={12}>
          <TextField fullWidth name="id_frmw" label="Numéro de passeport sportif" onChange={(e)=>setNom(e.target.value)} required/>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="nom" label="Nom de famille" onChange={(e)=>setNom(e.target.value)} required/>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="prenom" label="Prénom" onChange={(e)=>setPrenom(e.target.value)} required/>
        </Grid>

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
            mt:-30
          }}
        >
          <Typography variant="h4">Authentification {isRegister ? '(inscription)' : ''}</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            {isRegister ? (
              <>
               Vous avez déjà un compte ?
              <Link
              variant="subtitle2"
              sx={{ ml: 0.5 }}
              onClick={() => setIsRegister(!isRegister)} // Toggle form
            >
              Se connecter
            </Link>
              </>
            ) : (
              <>
                Vous n’avez pas de compte ?
                <Link
                  variant="subtitle2"
                  sx={{ ml: 0.5 }}
                  onClick={() => setIsRegister(!isRegister)} // Toggle form
                >
                  Demander
                </Link>
              </>
            )}
          </Typography>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {isRegister ? 'Inscription' : 'Votre compte'}
            </Typography>
          </Divider>

          {isRegister ? renderFormRegister : renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
