import {createContainer, asClass} from 'awilix';
import Dependencies from './types';

import {
  SubmissionsRepositoryImplementation,
  EndpointsRepositoryImplementation,
  UsersRepositoryImplementation
} from '@/data/repositories';

import {
  WaitlistServiceImplementation,
  MailServiceImplementation,
  AuthServiceImplementation
} from '@/data/services';

const container = createContainer<Dependencies>();

container.register({
  /* Repositories */
  submissionsRepository: asClass(SubmissionsRepositoryImplementation),
  endpointsRepository: asClass(EndpointsRepositoryImplementation),
  usersRepository: asClass(UsersRepositoryImplementation),

  /* Services */
  waitlistService: asClass(WaitlistServiceImplementation),
  mailService: asClass(MailServiceImplementation),
  authService: asClass(AuthServiceImplementation)
});

export const resolve = container.resolve;
