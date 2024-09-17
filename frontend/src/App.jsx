import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dash from './components/dash';  
import Upload from './components/upload';
import FileUpload from './components/fileupload';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dash" element={<Dash />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/fileupload" element={<FileUpload />} />
        </Routes>
    </Router>
  );
}

export default App;