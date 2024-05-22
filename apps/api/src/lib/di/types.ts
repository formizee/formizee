import {
  UsersRepository,
  EndpointsRepository,
  SubmissionsRepository
} from 'domain/repositories';

import {AuthService, MailService} from 'domain/services';

export default interface Dependencies {
  /* Repositories */
  submissionsRepository: SubmissionsRepository;
  endpointsRepository: EndpointsRepository;
  usersRepository: UsersRepository;

  /* Services */
  authService: AuthService;
  mailService: MailService;
}
