import {createContainer, asClass} from 'awilix';
import Dependencies from './types';

import {
  SubmissionsRepositoryImplementation,
  EndpointsRepositoryImplementation,
  UsersRepositoryImplementation
} from '@/data/repositories';

import {
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
  authService: asClass(AuthServiceImplementation),
  mailService: asClass(MailServiceImplementation)
});

export const resolve = container.resolve;
