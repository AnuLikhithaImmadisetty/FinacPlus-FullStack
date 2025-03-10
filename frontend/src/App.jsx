import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupForm from './components/SignupForm';
import ViewUsers from './components/ViewUsers';
import EditUser from './components/EditUser';
import { Toaster } from 'react-hot-toast';
import User from './components/User';

export const baseurl = "http://localhost:5000/api/v1/user"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/view-users" element={<ViewUsers />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
      </Routes>
      <Toaster position='bottom' />
    </Router>
  );
}

export default App;
