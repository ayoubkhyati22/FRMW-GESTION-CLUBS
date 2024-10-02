import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress,
  Typography,
  Container,
  Box,
  Skeleton
} from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from 'src/firebase';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isWeekend, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const AttendanceCalendar = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);

      // Fetch users (this could be moved to a higher-level component if users don't change often)
      const usersCollection = collection(db, 'Users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);

      // Fetch attendance data for the current month in a single query
      const attendanceCollection = collection(db, 'Attendance');
      const q = query(
        attendanceCollection,
        where('__name__', '>=', format(start, 'yyyy-MM-dd')),
        where('__name__', '<=', format(end, 'yyyy-MM-dd'))
      );
      const querySnapshot = await getDocs(q);
      
      const monthData = {};
      querySnapshot.forEach((doc) => {
        monthData[doc.id] = doc.data().users;
      });

      setAttendanceData(monthData);
      setLoading(false);
    };

    fetchData();
  }, [currentMonth]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return '#4caf50';
      case 'absent': return '#f44336';
      default: return '#ffffff';
    }
  };

  const renderTableContent = () => (
    <TableBody>
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell component="th" scope="row">
            {user.prenom} {user.nom}
          </TableCell>
          {days.map((day) => {
            const dateString = format(day, 'yyyy-MM-dd');
            const status = attendanceData[dateString]?.[user.id];
            return (
              <TableCell key={dateString} align="center" style={{ padding: 0 }}>
                <Box 
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: getStatusColor(status),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '30px',
                    borderRadius:'3px'
                  }}
                >
                  {status === 'present' ? 'P' : status === 'absent' ? 'A' : ''}
                </Box>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Calendrier des présences - {format(currentMonth, 'MMMM yyyy', { locale: fr })}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Utilisateur</TableCell>
              {days.map((day) => (
                <TableCell 
                  key={day.toISOString()} 
                  align="center"
                  style={{
                    backgroundColor: isWeekend(day) ? '#f0f0f0' : 'inherit',
                    fontWeight: isWeekend(day) ? 'bold' : 'normal'
                  }}
                >
                  {format(day, 'd')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {loading ? (
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  {days.map((day) => (
                    <TableCell key={day.toISOString()}>
                      <Skeleton variant="rectangular" height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : renderTableContent()}
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AttendanceCalendar;