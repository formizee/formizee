import {createContainer, asClass} from 'awilix';
import {Dependencies} from './dependencies';

import {SupabaseAuthService} from '@/infrastructure/services';

/** The container for all the Injected Dependencies */
export const container = createContainer<Dependencies>();

container.register({
  authService: asClass(SupabaseAuthService).singleton()
});

/** Injects a class instance of the selected dependency */
export const resolve = container.resolve;

export default container;
