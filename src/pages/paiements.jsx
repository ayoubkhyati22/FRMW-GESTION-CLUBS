import { Helmet } from 'react-helmet-async';

import {Paiements} from 'src/sections/paiements/view';

// ----------------------------------------------------------------------

export default function PaiementPage() {
  return (
    <>
      <Helmet>
        <title> FRMWa | Nouveau Utulisateur </title>
      </Helmet>

      <Paiements />
    </>
  );
}
