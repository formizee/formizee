import {type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class SaveStorageFile {
  private readonly _service = resolve('storageService');
  private readonly _path: string;
  private readonly _file: File;

  constructor(path: string, file: File) {
    this._path = path;
    this._file = file;
  }

  public async run(): Promise<Response<URL>> {
    return await this._service.save(this._path, this._file);
  }
}
