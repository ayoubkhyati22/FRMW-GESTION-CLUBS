import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const users = [...Array(15)].map((_, index) => ({
  id: faker.string.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.person.fullName(),
  birthday: faker.person.fullName(),
  id_club: faker.id_club.name(),
  status: sample(['active', 'banned']),
  role: sample([  
    'Super admin',
    'Admin',
    'Entraineur',
    'Athlete'
  ]),
}));
