import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

export default function UserCreate() {


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Nouveau athlète</Typography>
      </Stack>
      <Card>
        Création d`un nouveau athlète.
      </Card>
    </Container>
  );
}
