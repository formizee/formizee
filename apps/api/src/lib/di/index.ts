import { createContainer, asClass } from "awilix";
import Dependencies from "./types";

import { UsersRepositoryImplementation } from "@/data/repositories";

const container = createContainer<Dependencies>();

container.register({
 usersRepository: asClass(UsersRepositoryImplementation),
});

export const resolve = container.resolve;
