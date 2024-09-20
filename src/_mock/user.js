import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const users = [...Array(15)].map((_, index) => ({
  id: faker.string.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.person.fullName(),
  datenaissance: faker.person.fullName(),
  company: faker.company.name(),
  status: sample(['active', 'banned']),
  role: sample([  
    'Super admin',
    'Admin',
    'Entraineur',
    'Athlete'
  ]),
}));
