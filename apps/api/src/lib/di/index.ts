import { createContainer, asClass } from "awilix";
import Dependencies from "./types";

import { 
  SubmissionsRepositoryImplementation,
  EndpointsRepositoryImplementation,
  UsersRepositoryImplementation
} from "@/data/repositories";

const container = createContainer<Dependencies>();

container.register({
  submissionsRepository: asClass(SubmissionsRepositoryImplementation),
  endpointsRepository: asClass(EndpointsRepositoryImplementation),
  usersRepository: asClass(UsersRepositoryImplementation),
});

export const resolve = container.resolve;
