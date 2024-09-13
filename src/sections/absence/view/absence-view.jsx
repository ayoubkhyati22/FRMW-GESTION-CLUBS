import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

export default function AbsenceView() {


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Gestion des absences</Typography>
      </Stack>
      <Card>
        Gérer les absences des athlètes.
      </Card>
    </Container>
  );
}
