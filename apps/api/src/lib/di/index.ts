import {
  APIKeysRepository,
  EndpointsRepository,
  SubmissionsRepository,
  TeamsRepository,
  UsersRepository
} from '@/data/repositories';
import {
  AuthService,
  MailService,
  StorageService,
  WaitlistService
} from '@/data/services';
import {asClass, createContainer} from 'awilix';
import type Dependencies from './types';

const container = createContainer<Dependencies>();

container.register({
  /* Repositories */
  submissionsRepository: asClass(SubmissionsRepository),
  endpointsRepository: asClass(EndpointsRepository),
  apiKeysRepository: asClass(APIKeysRepository),
  teamsRepository: asClass(TeamsRepository),
  usersRepository: asClass(UsersRepository),

  /* Services */
  waitlistService: asClass(WaitlistService),
  storageService: asClass(StorageService),
  mailService: asClass(MailService),
  authService: asClass(AuthService)
});

export const resolve = container.resolve;
