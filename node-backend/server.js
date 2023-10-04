// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const { google } = require('googleapis');
const fs = require('fs');
const auth = require('./auth'); // Your authentication code here
const app = express();
const PORT = process.env.PORT || 5000;

app.use(fileUpload());

// Upload route
app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  try {
    const drive = google.drive({ version: 'v3', auth });

    const file = req.files.file;
    const folderName = 'mypoc'; // Customize the folder name
    const folderId = await createFolder(drive, folderName);

    const uploadResponse = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
      },
      media: {
        body: fs.createReadStream(file.tempFilePath),
      },
    });

    fs.unlinkSync(file.tempFilePath); // Remove the temporary file
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while uploading the file' });
  }
});

// Download route
app.get('/download', async (req, res) => {
  try {
    const drive = google.drive({ version: 'v3', auth });

    const folderName = 'mypoc'; // Customize the folder name
    const folderId = await getFolderId(drive, folderName);

    const files = await drive.files.list({
      q: `'${folderId}' in parents`,
    });

    if (files.data.files.length === 0) {
      return res.status(404).json({ message: 'No files found in the folder' });
    }

    const fileId = files.data.files[0].id; // Assumes you want to download the first file
    const fileMetadata = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

    res.setHeader('Content-disposition', `attachment; filename=${fileMetadata.data.name}`);
    fileMetadata.data
      .on('end', () => {
        console.log('File downloaded successfully');
      })
      .on('error', (err) => {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'An error occurred while downloading the file' });
      })
      .pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while downloading the file' });
  }
});

// Helper function to create a folder
async function createFolder(drive, folderName) {
  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  const folderResponse = await drive.files.create({
    resource: folderMetadata,
  });
  return folderResponse.data.id;
}

// Helper function to get the folder ID
async function getFolderId(drive, folderName) {
  const response = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
  });
  if (response.data.files.length === 0) {
    throw new Error(`Folder '${folderName}' not found.`);
  }
  return response.data.files[0].id;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
