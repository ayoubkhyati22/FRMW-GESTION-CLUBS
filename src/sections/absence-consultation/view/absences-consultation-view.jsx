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
  Skeleton,
  TextField
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

  const fetchData = async (date) => {
    setLoading(true);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    // Fetch users
    const usersCollection = collection(db, 'Users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(userList);

    // Fetch attendance data for the selected month
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

  useEffect(() => {
    fetchData(currentMonth);
  }, [currentMonth]);

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setCurrentMonth(newDate);
  };

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
          <TableCell component="th" scope="row" style={{ position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Calendrier des présences
        </Typography>
        <Box style={{ background: 'white' }}>
        <TextField
        label="Chaoisissez le mois"
          type="month"
          value={format(currentMonth, 'yyyy-MM')}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

        </Box>
      </Box>
      <Typography variant="h5" gutterBottom>
        {format(currentMonth, 'MMMM yyyy', { locale: fr })}
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ position: 'sticky', left: 0, zIndex: 2, background: 'white' }}>Athlète</TableCell>
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