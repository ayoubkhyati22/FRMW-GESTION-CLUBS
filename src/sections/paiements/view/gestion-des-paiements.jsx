import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Button, Divider, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import gradesData from '../../../utils/grades.json'
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { toast } from 'react-toastify';
import { auth, db } from 'src/firebase';
import { doc, setDoc } from 'firebase/firestore';



// ----------------------------------------------------------------------

export default function Paiements() {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");

  const [id_frmw, setId_Frmw] = useState("");
  const [telephone, setTelephone] = useState("");

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [birthday, setBirthday] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isEnabledButton, setEnabledButton] = useState(false);

  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [colorGrade, setColorGrade] = useState("");

  useEffect(() => {
    setGrades(gradesData.grades);
  }, []);

  function generatePassword(length = 12, options = {}) {
    const defaultOptions = {
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true
    };

    const config = { ...defaultOptions, ...options };

    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (config.lowercase) chars += lowercaseChars;
    if (config.uppercase) chars += uppercaseChars;
    if (config.numbers) chars += numberChars;
    if (config.symbols) chars += symbolChars;

    if (chars.length === 0) {
      throw new Error('Au moins une option doit être activée');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    setPasswordRegister(password)
    return password;
  }

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Créer un utilisateur avec email et mot de passe
      await createUserWithEmailAndPassword(auth, emailRegister, passwordRegister);
      const user = auth.currentUser;
  
      if (user) {
  
        // Ajouter l'utilisateur avec le rôle d'entraîneur et associer l'ID du id_club
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          nom: nom,
          prenom: prenom,
          telephone: telephone,
          role: "Athlète",
          membre: "Actif",
          birthday: birthday,
          grade: selectedGrade,
          id_frmw: id_frmw,
          id_club: "l21YFPOGO9vfVEqY1pR1", // Associer l'ID du id_club ici
        });
  
        setIsLoading(false);
        toast.success("Le nouveau athlète " + nom + " a été enregistré avec succées.");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Nouveau athlète</Typography>
      </Stack>
      <Card sx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>

        <form style={{ margin: 20 }} onSubmit={handleCreateUser} >
          <b>Club:</b> KSCT
          <br />
          <b>Adresse:</b> 90 AINSEBAA RUE DES SOPHORAS

          <Grid container spacing={3}>

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
              <TextField fullWidth name="id_frmw" label="Numéro de passeport sportif" onChange={(e) => setId_Frmw(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth name="birthday" label="Date de naissance (jj/mm/yyyy)" onChange={(e) => setBirthday(e.target.value)} required />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth name="nom" label="Nom de famille" onChange={(e) => setNom(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth name="prenom" label="Prénom" onChange={(e) => setPrenom(e.target.value)} required />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth name="telephone" label="Numéro de téléphone" onChange={(e) => setTelephone(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                select
                name="grade"
                //label="Ville"
                value={selectedGrade}
                onChange={(e) => {
                  const selectedGradeObj = grades.find(grade => grade.nom === e.target.value);
                  setSelectedGrade(e.target.value);
                  setColorGrade(selectedGradeObj ? selectedGradeObj.code : '');
                }} SelectProps={{
                  native: true,
                }}
                required
              >
                <option value="">Sélectionnez un grade</option>
                {grades.map((grade, index) => (
                  <option key={index} value={grade.nom}>
                    {grade.nom}
                  </option>
                ))}
              </TextField>            </Grid>
            <Grid item xs={12} md={1}>
              <TextField sx={{
                backgroundColor: colorGrade,
                borderColor: 'black',
                borderRadius: 1,
                height: '56px',  // Hauteur standard d'un TextField
                width: '100%'
              }} fullWidth disabled />
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
                type={showPassword ? 'text' : 'password'}
                value={passwordRegister}
                onChange={(e) => setPasswordRegister(e.target.value)}
                disabled
                required
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="end">
              //       <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
              //         <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              //       </IconButton>
              //     </InputAdornment>
              //   ),
              // }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                color="secondary"
                onClick={() => generatePassword()}
              >
                Génerer
              </Button>
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
