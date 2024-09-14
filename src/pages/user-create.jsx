import { Helmet } from 'react-helmet-async';

import {UserCreate} from 'src/sections/user-create/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> FRMWa | Nouveau Utulisateur </title>
      </Helmet>

      <UserCreate />
    </>
  );
}
