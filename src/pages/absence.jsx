import { Helmet } from 'react-helmet-async';

import { AbsenceView } from 'src/sections/absence/view';

// ----------------------------------------------------------------------

export default function AbsencePage() {
  return (
    <>
      <Helmet>
        <title> FRMWa | Absences </title>
      </Helmet>

      <AbsenceView />
    </>
  );
}
