import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confPassword) {
      alert("New Password and Confirm Password do not match");
      return;
    }

    try {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found in local storage');
            return;
        }
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        
        const response = await axios.post('http://localhost:8000/api/v1/users/change-password', {
            oldPassword,
            newPassword,
            confPassword
        }, { headers });

        console.log(response.data);
        alert('Password changed successfully!');
    } catch (error) {
      console.error('There was an error changing the password!', error);
      alert('Failed to change password');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <Header />
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="oldPassword" className="block text-base font-medium text-gray-300 mb-1">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-base font-medium text-gray-300 mb-1">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confPassword" className="block text-base font-medium text-gray-300 mb-1">Confirm New Password:</label>
          <input
            type="password"
            id="confPassword"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded animate-neon">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
