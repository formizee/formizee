import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {SaveStorageFile} from '@/useCases/storage';

const getFiles = (formData: FormData): {key: string; value: File}[] => {
  const files: {key: string; value: File}[] = [];

  for (const entry of formData.entries()) {
    const [key, value] = entry;
    if (value instanceof File) {
      files.push({key, value});
    }
  }

  return files;
};

const getFileExtension = (fileName: string): string => {
  const extensions = fileName.split('.').filter(Boolean).slice(1).join('.');

  if (extensions !== '') {
    return `.${extensions}`;
  }

  return '';
};

export const handleFormFiles = async (
  teamName: string,
  endpointId: string,
  formData: FormData
): Promise<FormData> => {
  const files = getFiles(formData);
  const responseForm = formData;

  if (files.length === 0) {
    return formData;
  }

  const basePath = `${teamName}/uploads/${endpointId}`;

  for (const file of files) {
    const fileName = `${randomUUID()}${getFileExtension(file.value.name)}`;

    const service = new SaveStorageFile(join(basePath, fileName), file.value);
    const response = await service.run();

    if (response.ok) {
      const value = `{"name": "${file.value.name}", "url": "${response.body.href}"`;
      responseForm.set(file.key, value);
    }
  }

  return responseForm;
};
