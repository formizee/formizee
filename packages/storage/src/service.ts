import {type Database, schema} from '@formizee/db';
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

  public async deleteSubmissionData(database: Database, submissionId: string) {
    const fileUploads = await database.query.fileUpload.findMany({
      where: (table, {eq}) => eq(table.submissionId, submissionId)
    });

    if (fileUploads.length < 1) {
      return;
    }

    await Promise.all(
      fileUploads.map(async file => {
        await this.deleteObject(file.fileKey);
      })
    );
  }
}
