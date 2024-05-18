import React, { useState } from 'react';
import axios from 'axios';

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="oldPassword">Old Password:</label>
        <input
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="confPassword">Confirm New Password:</label>
        <input
          type="password"
          id="confPassword"
          value={confPassword}
          onChange={(e) => setConfPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePasswordForm;
