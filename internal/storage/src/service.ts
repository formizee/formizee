import {type Database, schema} from '@formizee/db/submissions';
import {BaseStorage} from './storage';
import {newId} from '@formizee/id';

interface FileUpload {
  name: string;
  field: string;
}

export class Storage extends BaseStorage {
  public async getUploadLinks(
    database: Database,
    fileUploads: FileUpload[],
    endpointId: string,
    submissionId: string
  ) {
    try {
      const response = await Promise.all(
        fileUploads.map(async ({field, name}) => {
          if (name === '') {
            return {
              field,
              url: null
            };
          }

          const fileId = newId('fileUpload');
          const extension = name.includes('.') ? `.${name.split('.')[1]}` : '';
          const fileKey = `${endpointId}/${submissionId}/${fileId}${extension}`;

          await database.insert(schema.fileUpload).values({
            id: fileId,
            fileKey,
            field,
            name,
            submissionId
          });

          const url = await this.generatePutPresignedUrl(fileKey);

          return {
            url,
            field
          };
        })
      );
      return Promise.resolve(response);
    } catch (error) {
      console.error('Error while handling file uploads:', error);
      return Promise.resolve([]);
    }
  }

  public async getDownloadLinks(database: Database, submissionId: string) {
    const fileUploads = await database.query.fileUpload.findMany({
      where: (table, {eq}) => eq(table.submissionId, submissionId)
    });

    if (fileUploads.length < 1) {
      return Promise.resolve([]);
    }

    try {
      const response = await Promise.all(
        fileUploads.map(async file => {
          const url = await this.generateGetPresignedUrl(file.fileKey);

          return {
            [file.field]: {
              url,
              name: file.name
            }
          };
        })
      );

      return Promise.resolve(response);
    } catch (error) {
      console.error('Error while handling file uploads:', error);
    }

    return Promise.resolve([]);
  }

  public async deleteSubmissionData(
    database: Database,
    submissionId: string
  ): Promise<{freeSpace: number}> {
    const fileUploads = await database.query.fileUpload.findMany({
      where: (table, {eq}) => eq(table.submissionId, submissionId)
    });

    let freeSpace = 0;

    try {
      await Promise.all(
        fileUploads.map(async file => {
          const object = await this.getObject(file.fileKey);
          if (object) {
            const spaceUsed = Number(object.headers.get('Content-Length'));
            freeSpace += spaceUsed;
          }
          await this.deleteObject(file.fileKey);
        })
      );

      return Promise.resolve({freeSpace});
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
