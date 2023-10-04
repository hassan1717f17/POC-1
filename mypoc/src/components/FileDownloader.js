// src/components/FileDownloader.js
import React from 'react';
import Button from 'react-bootstrap/Button';

const FileDownloader = () => {
  const handleDownload = async () => {
    try {
      window.open('/download', '_blank');
    } catch (error) {
      console.error(error);
      alert('An error occurred while downloading the file');
    }
  };

  return (
    <div>
      <Button variant="success" onClick={handleDownload}>
        Download File
      </Button>
    </div>
  );
};

export default FileDownloader;
