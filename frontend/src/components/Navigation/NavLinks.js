import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';

import './NavLinks.css';

const NavLinks = () => {
  const authCtx = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact="true">
          All USERS
        </NavLink>
      </li>
      {authCtx.isLoggedIn && (
        <li>
          <NavLink to={`/${authCtx.userId}`}>Profile</NavLink>
        </li>
      )}
      {!authCtx.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <button onClick={authCtx.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
