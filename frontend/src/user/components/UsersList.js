import React from 'react';
import './UsersList.css';

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    );
  }
  return (
    <ul className="users-list">
      <li className="user-row">
        <span className="header">Name</span>
        <span className="header">Email</span>
      </li>
      {props.items.map((user) => (
        <li key={user._id} className="user-row">
          <span className="user-item">{user.name}</span>
          <span className="user-item">{user.email}</span>
        </li>
      ))}
    </ul>
  );
};

export default UsersList;
