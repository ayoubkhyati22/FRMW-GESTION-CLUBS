import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { styled } from '@mui/material/styles';
import { db } from 'src/firebase';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

const AttendanceButton = styled(Button)(({ theme, isSelected, colorWhenSelected }) => ({
  margin: theme.spacing(0, 1),
  minWidth: 100,
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[400],
  },
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.short,
  }),
  ...(isSelected && {
    backgroundColor: colorWhenSelected,
    color: theme.palette.getContrastText(colorWhenSelected),
    '&:hover': {
      backgroundColor: colorWhenSelected,
    },
  }),
}));

export default function AbsenceView() {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const formattedDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE dd MMMM yyyy', { locale: fr });

  useEffect(() => {
    const fetchUsersAndAttendance = async () => {
      try {
        const usersCollection = collection(db, 'Users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);

        // Fetch attendance for the selected date
        const attendanceDoc = doc(db, 'Attendance', date);
        const attendanceSnapshot = await getDoc(attendanceDoc);
        if (attendanceSnapshot.exists()) {
          setAttendance(attendanceSnapshot.data().users || {});
        } else {
          // Initialize with all users present if no data exists for the date
          const initialAttendance = {};
          userList.forEach(user => {
            initialAttendance[user.id] = 'present';
          });
          setAttendance(initialAttendance);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setLoading(false);
        enqueueSnackbar('Erreur lors de la récupération des données', { variant: 'error' });
      }
    };

    fetchUsersAndAttendance();
  }, [date, enqueueSnackbar]);

  const handleAttendanceChange = (userId, newStatus) => {
    setAttendance(prev => ({
      ...prev,
      [userId]: newStatus
    }));
  };

  const handleSave = async () => {
    try {
      const attendanceDoc = doc(db, 'Attendance', date);
      await setDoc(attendanceDoc, { users: attendance }, { merge: true });

      enqueueSnackbar('Présences/absences enregistrées avec succès', { variant: 'success' });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des présences/absences:", error);
      enqueueSnackbar("Erreur lors de l'enregistrement des présences/absences", { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Gestion des présences/absences</Typography>
      </Stack>
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ mr: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Typography variant="h7" sx={{ textTransform: 'capitalize' }}>{formattedDate}</Typography>
        </Box>
        <List>
          {users.map(user => (
            <ListItem
              key={user.id}
              divider
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                py: 2,
                px: 3,
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flexGrow: 1,
                mb: isMobile ? 2 : 0,
                mr: isMobile ? 0 : 2
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {`${user.prenom} ${user.nom}`}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  ◉ séance précédente: null
                </Typography>
                <Typography variant="body2">
                  ◉ absences: null
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'flex-end'
              }}>
                <AttendanceButton
                  variant="contained"
                  onClick={() => handleAttendanceChange(user.id, 'present')}
                  isSelected={attendance[user.id] === 'present'}
                  colorWhenSelected="#4caf50"
                  fullWidth={isMobile}
                >
                  Présent
                </AttendanceButton>
                <AttendanceButton
                  variant="contained"
                  onClick={() => handleAttendanceChange(user.id, 'absent')}
                  isSelected={attendance[user.id] === 'absent'}
                  colorWhenSelected="#f44336"
                  fullWidth={isMobile}
                >
                  Absent
                </AttendanceButton>
              </Box>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleSave}
          sx={{ mt: 2 }}
          fullWidth={isMobile}
        >
          Enregistrer les présences / absences
        </Button>
      </Card>
    </Container>
  );
}