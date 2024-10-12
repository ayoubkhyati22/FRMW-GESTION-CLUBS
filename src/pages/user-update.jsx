import { Helmet } from 'react-helmet-async';

import {UserUpdate} from 'src/sections/user-update/view';

// ----------------------------------------------------------------------

export default function UserUpdatePage() {
  return (
    <>
      <Helmet>
        <title> FRMW | Nouveau Utulisateur </title>
      </Helmet>

      <UserUpdate />
    </>
  );
}
