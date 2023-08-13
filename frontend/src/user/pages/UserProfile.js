import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState();
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + authCtx.token,
          }
        );
        setUser(responseData);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId, authCtx]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && user && (
        <div className="user-profile">
          <h1>Welcome {user.name}!</h1>
          <p>There is your private data...</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
