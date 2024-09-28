import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Divider, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import gradesData from '../../../utils/grades.json'
import { toast } from 'react-toastify';
import { db } from 'src/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

export default function UserUpdate() {
    const { userId } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [id_frmw, setId_Frmw] = useState("");
    const [telephone, setTelephone] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [birthday, setBirthday] = useState("");

    const [membre, setMembre] = useState([]);
    const [selectedMembre, setSelectedMembre] = useState("");

    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState("");
    const [colorGrade, setColorGrade] = useState("");

    useEffect(() => {
        setGrades(gradesData.grades);
        fetchUserData();
    }, [userId]);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const userDoc = await getDoc(doc(db, "Users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setEmail(userData.email);
                setId_Frmw(userData.id_frmw);
                setTelephone(userData.telephone);
                setNom(userData.nom);
                setPrenom(userData.prenom);
                setBirthday(userData.birthday);
                setSelectedGrade(userData.grade);
                // const gradeObj = grades.find(grade => grade.nom === userData.grade);
                setColorGrade(userData.grade);
                setSelectedMembre(userData.membre)
            } else {
                toast.error("Utilisateur non trouvé");
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération des données : " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateDoc(doc(db, "Users", userId), {
                email,
                nom,
                prenom,
                telephone,
                birthday,
                grade: selectedGrade,
                membre: selectedMembre,
                id_frmw,
            });

            toast.success("Les informations de l'athlète " + nom + " ont été mises à jour avec succès.");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour : " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Modifier athlète</Typography>
            </Stack>
            <Card sx={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <form style={{ margin: 20 }} onSubmit={handleUpdateUser} >
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Divider sx={{ my: 3 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {'Informations athlète'}
                                </Typography>
                            </Divider>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField fullWidth name="id_frmw" label="Numéro de passeport sportif" value={id_frmw} onChange={(e) => setId_Frmw(e.target.value)} required />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth name="birthday" label="Date de naissance (jj/mm/yyyy)" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField fullWidth name="nom" label="Nom de famille" value={nom} onChange={(e) => setNom(e.target.value)} required />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth name="prenom" label="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField fullWidth name="telephone" label="Numéro de téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                select
                                name="grade"
                                value={selectedGrade}
                                onChange={(e) => {
                                    const selectedGradeObj = grades.find(grade => grade.nom === e.target.value);
                                    setSelectedGrade(e.target.value);
                                    setColorGrade(selectedGradeObj ? selectedGradeObj.code : '');
                                }}
                                SelectProps={{
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
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <TextField sx={{
                                backgroundColor: colorGrade,
                                borderColor: 'black',
                                borderRadius: 1,
                                height: '56px',
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
                            <TextField fullWidth name="email" label="Adresse mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                name="membre"
                                value={selectedMembre}
                                onChange={(e) => {
                                    setSelectedMembre(e.target.value);
                                }}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value="">Sélectionnez un statut</option>
                                <option value="Actif">Actif</option>
                                <option value="Partie">Partie</option>
                            </TextField>
                        </Grid>

                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="primary"
                            loading={isLoading}
                        >
                            Mettre à jour l'athlète
                        </LoadingButton>
                    </Box>
                </form>
            </Card>
        </Container>
    );
}