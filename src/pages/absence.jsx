import { SnackbarProvider } from 'notistack';
import { Helmet } from 'react-helmet-async';

import { AbsenceView } from 'src/sections/absence/view';

// ----------------------------------------------------------------------

export default function AbsencePage() {
  return (
    <>
      <Helmet>
        <title> FRMW | Absences </title>
      </Helmet>

      <SnackbarProvider maxSnack={3}>
      <AbsenceView />
      </SnackbarProvider>

    </>
  );
}
