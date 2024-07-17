import type {
  APIKeysRepository,
  EndpointsRepository,
  SubmissionsRepository,
  TeamsRepository,
  UsersRepository
} from 'domain/repositories';
import type {
  AuthService,
  MailService,
  StorageService,
  WaitlistService
} from 'domain/services';

export default interface Dependencies {
  /* Repositories */
  submissionsRepository: SubmissionsRepository;
  endpointsRepository: EndpointsRepository;
  apiKeysRepository: APIKeysRepository;
  teamsRepository: TeamsRepository;
  usersRepository: UsersRepository;

  /* Services */
  waitlistService: WaitlistService;
  storageService: StorageService;
  mailService: MailService;
  authService: AuthService;
}
