import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import AppWidgetSummary from '../app-widget-summary';
import AppWebsiteVisits from '../app-website-visits';
import AppCurrentVisits from '../app-current-visits';
import { auth, db } from "../../../firebase";
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

// Define a mapping of grade names to their actual colors
const gradeColorMap = {
  'White': '#FFFFFF',
  'Yellow': '#FFFF00',
  'Orange': '#FFA500',
  'Gray': '#808080',
  'Green': '#008000',
  'Purple': '#800080',
  'Red': '#FF0000',
  'Brown': '#8B4513',
  'Black': '#000000'
};


export default function AppView() {
  const [userDetails, setUserDetails] = useState(null);
  const [activeUserCount, setActiveUserCount] = useState(null);
  const [inactiveUserCount, setInactiveUserCount] = useState(null);
  const [clubCount, setClubCount] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchGradeDistribution = async () => {
    try {
      const usersCollection = collection(db, "Users");
      const snapshot = await getDocs(usersCollection);
      
      const gradeCounts = {};
      let totalUsers = 0;

      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.grade) {
          gradeCounts[userData.grade] = (gradeCounts[userData.grade] || 0) + 1;
          totalUsers++;
        }
      });

      const distribution = Object.entries(gradeCounts).map(([grade, count]) => ({
        label: grade,
        value: Math.round((count / totalUsers) * 100)
      }));

      setGradeDistribution(distribution);
    } catch (error) {
      console.error("Error fetching grade distribution:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserData(),
        countActiveUsers(),
        countInactiveUsers(),
        countClubs(),
        fetchAttendanceData(),
        fetchGradeDistribution()
      ]);
      setLoading(false);
    };

    fetchAllData();
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

  return (
    <>
    
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi {userDetails ? (userDetails.prenom ? userDetails.prenom : 'chargement...') : 'chargement...'}, Welcome back 👋
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Clubs"
              total={loading ? <span className="loader"></span> : clubCount}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/icons8-temple-100.png" />}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                '::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url("/assets/icons/glass/icons8-temple-100.png")',
                  backgroundPosition: 'right',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  opacity: 0.1,
                  zIndex: 0,
                },
                zIndex: 1,
                background: 'linear-gradient(to bottom right, rgba(204, 85, 0, 0.1), rgba(255, 165, 0, 0.1))',
                borderRadius: '16px',
                border: 3,
                borderColor: 'Orange'
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Athlètes actif"
              total={loading ? <span className="loader"></span> : activeUserCount}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/user-icon.png" />}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                '::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url("/assets/icons/glass/icons8-coche-100.png")',
                  backgroundPosition: 'right',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  opacity: 0.2,
                  zIndex: 0,
                },
                zIndex: 1,
                background: 'linear-gradient(to bottom right, rgba(0, 128, 0, 0.1), rgba(0, 255, 0, 0.1))',
                borderRadius: '16px',
                border: 3,
                borderColor: 'Green'
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Athlètes partie"
              total={loading ? <span className="loader"></span> : inactiveUserCount}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/user-icon.png" />}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                '::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url("/assets/icons/glass/icons8-effacer-100.png")',
                  backgroundPosition: 'right',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  opacity: 0.2,
                  zIndex: 0,
                },
                zIndex: 1,
                background: 'linear-gradient(to bottom right, rgba(128, 0, 0, 0.1), rgba(255, 0, 0, 0.1))',
                borderRadius: '16px',
                border: 3,
                borderColor: 'Red'
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Paiement pour ce mois"
              total={loading ? <span className="loader"></span> : '56'}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/icons8-sac-d'argent-euro-100.png" />}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                '::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url("/assets/icons/glass/icons8-pourcentage-100.png")',
                  backgroundPosition: 'right',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  opacity: 0.2,
                  zIndex: 0,
                },
                zIndex: 1,
                background: 'linear-gradient(to bottom right, rgba(0, 128, 128, 0.1), rgba(0, 255, 255, 0.1))',
                borderRadius: '16px',
                border: 3,
                borderColor: '#0047AB'
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <span className="loader"></span>
              </div>
            ) : (
              <AppWebsiteVisits
                title="Aperçu de la fréquentation"
                subheader="Présence et absence par mois"
                chart={chartData}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <span className="loader"></span>
              </div>
            ) : (
              <AppCurrentVisits
                title="Distribution des grades"
                chart={{
                  series: gradeDistribution,
                  colors: gradeDistribution.map(item => gradeColorMap[item.label] || '#000000'),
                }}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}