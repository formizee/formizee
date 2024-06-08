import {createContainer, asClass} from 'awilix';
import {
  UsersRepository,
  EndpointsRepository,
  SubmissionsRepository
} from '@/data/repositories';
import type Dependencies from './types';

const container = createContainer<Dependencies>();

container.register({
  /* Repositories */
  submissionsRepository: asClass(SubmissionsRepository),
  endpointsRepository: asClass(EndpointsRepository),
  usersRepository: asClass(UsersRepository)

  /* Services 
  waitlistService: asClass(WaitlistServiceImplementation),
  mailService: asClass(MailServiceImplementation),
  authService: asClass(AuthServiceImplementation)
  */
});

export const resolve = container.resolve;
