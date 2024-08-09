import {createTRPCReact} from '@trpc/react-query';
import type {AppRouter} from './routers';

export const api = createTRPCReact<AppRouter>();
