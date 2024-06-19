import {
  type UsersRepository,
  type EndpointsRepository,
  type SubmissionsRepository
} from 'domain/repositories';
import {
  type AuthService,
  type MailService,
  type StorageService,
  type WaitlistService
} from 'domain/services';

export default interface Dependencies {
  /* Repositories */
  submissionsRepository: SubmissionsRepository;
  endpointsRepository: EndpointsRepository;
  usersRepository: UsersRepository;

  /* Services */
  waitlistService: WaitlistService;
  storageService: StorageService;
  mailService: MailService;
  authService: AuthService;
}
