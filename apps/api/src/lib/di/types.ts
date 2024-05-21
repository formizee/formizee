import { UsersRepository, EndpointsRepository, SubmissionsRepository } from "domain/repositories";

export default interface Dependencies {
  submissionsRepository: SubmissionsRepository;
  endpointsRepository: EndpointsRepository;
  usersRepository: UsersRepository;
}
