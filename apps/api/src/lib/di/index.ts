/*eslint import/no-cycle: [2, { maxDepth: 1 }] -- The depth is allowed in order to reuse cases */

import {createContainer, asClass} from 'awilix';
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
import type Dependencies from './types';

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
