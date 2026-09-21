// src/lib/googleDrive.js

/**
 * Uploads a file to Google Drive using the REST API.
 * @param {Blob} blob - The file blob to upload
 * @param {string} fileName - The name of the file
 * @param {string} accessToken - The OAuth access token with drive.file scope
 * @returns {Promise<Object>} The uploaded file metadata
 */
export async function uploadToGoogleDrive(blob, fileName, accessToken) {
  const metadata = {
    name: fileName,
    mimeType: blob.type
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
