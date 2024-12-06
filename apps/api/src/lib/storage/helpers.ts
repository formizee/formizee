import {fileTypeFromBlob} from 'file-type';

export const uploadObject = async (signedUrl: string, file: File) => {
  try {
    const fileType = await fileTypeFromBlob(file);
    const contentType = await parseDangerousFiles(fileType?.mime);

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const request = new Request(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': `attachment; filename="${file.name}"`,
        'Content-Security-Policy':
          "default-src 'none'; script-src 'none'; object-src 'none'"
      },
      body: fileBuffer
    });

    await fetch(request);
  } catch (error) {
    Promise.reject(error);
  }
};

const parseDangerousFiles = async (mime: string | undefined) => {
  const dangerousFileTypes = [
    // Executable Files
    'application/x-msdownload',
    'application/x-httpd-php',
    'application/javascript',
    'application/xhtml+xml',
    'application/x-sh',
    'text/x-python',
    'text/x-perl',
    'text/html',

    // Media Files
    'application/json',
    'application/pdf',
    'image/svg+xml',
    'image/x-icon',
    'image/gif',

    // Office Specific
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (mime !== undefined && !dangerousFileTypes.includes(mime)) {
    return mime;
  }

  return 'application/octet-stream';
};
