import {
  UsersRepository,
  EndpointsRepository,
  SubmissionsRepository
} from 'domain/repositories';
import { AuthService } from 'domain/services'

export default interface Dependencies {

  /* Repositories */
  submissionsRepository: SubmissionsRepository;
  endpointsRepository: EndpointsRepository;
  usersRepository: UsersRepository;

  /* Services */
  authService: AuthService;

}
