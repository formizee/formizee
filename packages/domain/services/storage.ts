import type {Response} from '../models';

export interface StorageService {
  load: (path: string) => Promise<Response<File>>;
  save: (path: string, file: File) => Promise<Response<URL>>;
  delete: (path: string) => Promise<Response<true>>;
}
