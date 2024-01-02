import React, { Component } from 'react';
import { withRouter } from './withRouter';

class Fileupload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
    };
  }

  handleFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  handleUpload = () => {
    const formData = new FormData();
    formData.append('file', this.state.selectedFile);
  
    this.setState({
      selectedFile: null,
    });
  
    // Assuming your FastAPI server is running on http://localhost:8000
    const apiUrl = 'http://localhost:8000/process-pdf';
  
    // Retrieve token from local storage
    const token = localStorage.getItem('token');
  
    // Check if token exists before making the request
    if (!token) {
      console.error('Token not found in local storage');
      return;
    }
  
    fetch(apiUrl, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Handle the response data as needed
        console.log('Success:', data);
  
        // Assuming you want to do something with the result in your React component
        this.setState({
          result: data.result,
        });
      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error);
      });
  };
  
  render() {
    const { selectedFile,result } = this.state;

    return (
      <div>
      <input type="file" onChange={this.handleFileChange} />
      <button onClick={this.handleUpload}>process</button>

      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
        </div>
      )}

      {result && (
        <div>
          <h2>Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
    );
  }
}

export default withRouter(Fileupload);
