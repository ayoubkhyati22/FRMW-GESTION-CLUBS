import { SnackbarProvider } from 'notistack';
import { Helmet } from 'react-helmet-async';

import { AbsencesConsultationView } from 'src/sections/absence-consultation/view';

// ----------------------------------------------------------------------

export default function AbsenceConsultationPage() {
  return (
    <>
      <Helmet>
        <title> FRMW | Absences Consultation </title>
      </Helmet>

      <SnackbarProvider maxSnack={3}>
      <AbsencesConsultationView />
      </SnackbarProvider>

    </>
  );
}
