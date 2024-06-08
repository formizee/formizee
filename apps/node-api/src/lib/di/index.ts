import {createContainer, asClass} from 'awilix';
import {
  UsersRepository,
  EndpointsRepository,
  SubmissionsRepository
} from '@/data/repositories';
import {AuthService, MailService, WaitlistService} from '@/data/services';
import type Dependencies from './types';

const container = createContainer<Dependencies>();

container.register({
  /* Repositories */
  submissionsRepository: asClass(SubmissionsRepository),
  endpointsRepository: asClass(EndpointsRepository),
  usersRepository: asClass(UsersRepository),

  /* Services */
  waitlistService: asClass(WaitlistService),
  mailService: asClass(MailService),
  authService: asClass(AuthService)
});

export const resolve = container.resolve;
