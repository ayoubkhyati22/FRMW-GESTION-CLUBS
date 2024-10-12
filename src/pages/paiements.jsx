import { Helmet } from 'react-helmet-async';

import {Paiements} from 'src/sections/paiements/view/PaymentManager/';
// ----------------------------------------------------------------------

export default function PaiementPage() {
  return (
    <>
      <Helmet>
        <title> FRMW | Nouveau Utulisateur </title>
      </Helmet>

      <Paiements />
    </>
  );
}
