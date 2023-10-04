import React from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import FileDownloader from './components/FileDownloader';

function App() {
  return (
    <div className="App">
      
      <h1>Google Drive File Uploader & Downloader</h1>
      <FileUploader />
      <FileDownloader />
    </div>
  );
}



export default App;
