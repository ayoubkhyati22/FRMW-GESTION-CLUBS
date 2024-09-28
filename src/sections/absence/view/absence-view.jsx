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
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { styled } from '@mui/material/styles';
import { db } from 'src/firebase';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'Users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
        setAttendance(userList.map(user => ({ id: user.id, status: null })));
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAttendanceChange = (userId, newStatus) => {
    setAttendance(prev =>
      prev.map(item =>
        item.id === userId
          ? { ...item, status: item.status === newStatus ? null : newStatus }
          : item
      )
    );
  };

  const handleSave = async () => {
    try {
      const attendanceCollection = collection(db, 'Attendance');
      const date = new Date().toISOString().split('T')[0];
      
      await setDoc(doc(attendanceCollection, date), {
        date,
        records: attendance
      });

      console.log('Présences enregistrées avec succès');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des présences:", error);
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
        <Typography variant="h4">Gestion des absences</Typography>
      </Stack>
      <Card sx={{ p: 3 }}>
        <List>
          {users.map(user => {
            const userAttendance = attendance.find(a => a.id === user.id);
            return (
              <ListItem 
                key={user.id} 
                divider 
                sx={{ 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  py: isMobile ? 2 : 1
                }}
              >
                <ListItemText 
                  primary={`${user.prenom} ${user.nom}`} 
                  sx={{ mb: isMobile ? 1 : 0 }}
                />
                <Box sx={{ display: 'flex', width: isMobile ? '100%' : 'auto' }}>
                  <AttendanceButton
                    variant="contained"
                    onClick={() => handleAttendanceChange(user.id, 'present')}
                    isSelected={userAttendance?.status === 'present'}
                    colorWhenSelected="#4caf50"
                    fullWidth={isMobile}
                  >
                    Présent
                  </AttendanceButton>
                  <AttendanceButton
                    variant="contained"
                    onClick={() => handleAttendanceChange(user.id, 'absent')}
                    isSelected={userAttendance?.status === 'absent'}
                    colorWhenSelected="#f44336"
                    fullWidth={isMobile}
                  >
                    Absent
                  </AttendanceButton>
                </Box>
              </ListItem>
            );
          })}
        </List>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleSave}
          sx={{ mt: 2 }}
          fullWidth={isMobile}
        >
          Enregistrer la présence
        </Button>
      </Card>
    </Container>
  );
}