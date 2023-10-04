// src/components/FileUploader.js
import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import Button from 'react-bootstrap/Button';

const CLIENT_ID = '849586484429-7h4720oicljv9b47o67rjkfp1guqv75e.apps.googleusercontent.com'; // Replace with your OAuth 2.0 client ID

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signInMessage, setSignInMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    // Wait for a short delay to ensure the state is updated
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!isLoggedIn) {
      alert('Please sign in with Google first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading the file');
    }
  };

  const responseGoogle = (response) => {
    if (response.accessToken) {
      setIsLoggedIn(true);
      setSignInMessage('Sign-in successful'); // Set the sign-in message
    }
  };

  return (
    <div>
      {signInMessage && <p>{signInMessage}</p>}
      <input type="file" onChange={handleFileChange} />
      <Button variant="primary" onClick={handleUpload}>
        Upload File
      </Button>
      <br />
      <br />
      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default FileUploader;
