import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from 'react-router-dom';
import { useAuth } from './hooks/auth-hook';
import Users from './user/pages/Users';
import Auth from './user/pages/Auth';
import MainNavigation from './components/Navigation/MainNavigation';
import { AuthContext } from './context/auth-context';
import LoadingSpinner from './components/UIElements/LoadingSpinner';
import UserProfile from './user/pages/UserProfile';

const App = () => {
  const { token, login, logout, userId } = useAuth();
  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path="/" exact element={<Users />} />
        <Route path="/:userId" exact element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" exact element={<Users />} />
        <Route path="/auth" exact element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
