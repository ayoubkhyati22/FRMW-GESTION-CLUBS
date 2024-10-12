import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import AppWidgetSummary from '../app-widget-summary';
import AppWebsiteVisits from '../app-website-visits';
import AppCurrentVisits from '../app-current-visits';
import { auth, db } from "../../../firebase";
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export default function AppView() {
  const [userDetails, setUserDetails] = useState(null);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [inactiveUserCount, setInactiveUserCount] = useState(0);
  const [clubCount, setClubCount] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDetails(userData);
        } else {
          console.log("Utilisateur non connecté");
        }
      }
    });
  };

  const countActiveUsers = async () => {
    const usersCollection = collection(db, "Users");
    const activeUsersQuery = query(usersCollection, where("membre", "==", "Actif"));
    const snapshot = await getDocs(activeUsersQuery);
    setActiveUserCount(snapshot.size);
  };

  const countInactiveUsers = async () => {
    const usersCollection = collection(db, "Users");
    const inactiveUsersQuery = query(usersCollection, where("membre", "==", "Partie"));
    const snapshot = await getDocs(inactiveUsersQuery);
    setInactiveUserCount(snapshot.size);
  };

  const countClubs = async () => {
    const clubsCollection = collection(db, "Clubs");
    const snapshot = await getDocs(clubsCollection);
    setClubCount(snapshot.size);
  };

  const fetchAttendanceData = async () => {
    try {
      const attendanceCollection = collection(db, "Attendance");
      const snapshot = await getDocs(attendanceCollection);
      
      const monthlyData = new Array(12).fill(0).map(() => ({ present: 0, absent: 0 }));

      snapshot.forEach((doc) => {
        const [year, month, day] = doc.id.split('-').map(Number);
        const monthIndex = month - 1; // Adjust for 0-indexed months

        if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
          console.error(`Invalid month in document ID: ${doc.id}`);
          return; // Skip this document
        }

        const data = doc.data();

        if (data && data.users) {
          Object.values(data.users).forEach((status) => {
            if (status === "present") {
              monthlyData[monthIndex].present++;
            } else if (status === "absent") {
              monthlyData[monthIndex].absent++;
            }
          });
        }
      });

      console.log("Fetched attendance data:", monthlyData);
      setAttendanceData(monthlyData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    countActiveUsers();
    countInactiveUsers();
    countClubs();
    fetchAttendanceData();
  }, []);

  const currentYear = new Date().getFullYear();
  const chartLabels = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));

  const chartData = {
    labels: chartLabels,
    series: [
      {
        name: 'Present',
        type: 'column',
        fill: 'solid',
        data: attendanceData.map((data, index) => ({
          x: chartLabels[index],
          y: data.present
        })),
      },
      {
        name: 'Absent',
        type: 'column',
        fill: 'solid',
        data: attendanceData.map((data, index) => ({
          x: chartLabels[index],
          y: data.absent
        })),
      },
    ],
  };

  console.log("Chart data:", chartData);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi {userDetails ? (userDetails.prenom ? userDetails.prenom : 'chargement...') : 'chargement...'}, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Clubs"
            total={clubCount}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/icons8-temple-94.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Athlètes actif"
            total={activeUserCount}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Athlètes partie"
            total={inactiveUserCount}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        {/* <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Bug Reports"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          {attendanceData.length > 0 ? (
            <AppWebsiteVisits
              title="Attendance Overview"
              subheader="Presence and Absence by Month"
              chart={chartData}
            />
          ) : (
            <Typography>Loading attendance data...</Typography>
          )}
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}