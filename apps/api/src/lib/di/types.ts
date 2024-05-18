import { UsersRepository } from "domain/repositories";

export default interface Dependencies {
  usersRepository: UsersRepository;
}
