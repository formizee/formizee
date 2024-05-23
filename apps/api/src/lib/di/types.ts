import {
  UsersRepository,
  EndpointsRepository,
  SubmissionsRepository
} from 'domain/repositories';

import {AuthService, MailService, WaitlistService} from 'domain/services';

export default interface Dependencies {
  /* Repositories */
  submissionsRepository: SubmissionsRepository;
  endpointsRepository: EndpointsRepository;
  usersRepository: UsersRepository;

  /* Services */
  waitlistService: WaitlistService;
  mailService: MailService;
  authService: AuthService;
}
