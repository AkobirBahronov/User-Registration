import React, { useState, useContext, useCallback, useRef } from 'react';

import Card from '../../components/UIElements/Card';
import Input from '../../components/FormElements/Input';
import Button from '../../components/FormElements/Button';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_HAS_LOWER_CASE,
  VALIDATOR_HAS_NUMBERS,
  VALIDATOR_HAS_UPPER_CASE,
  VALIDATOR_MATCH_PASSWORD,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../util/validators';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import './Auth.css';

const Auth = () => {
  const childRef = useRef();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          'POST',
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  const passwordInputHandler = useCallback(
    (id, value, isValid) => {
      childRef.current?.validateConfirmPassword(value);
      inputHandler(id, value, isValid);
    },
    [inputHandler, childRef]
  );

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[
              VALIDATOR_MINLENGTH(8),
              VALIDATOR_HAS_LOWER_CASE(),
              VALIDATOR_HAS_UPPER_CASE(),
              VALIDATOR_HAS_NUMBERS(),
            ]}
            errorText="Password must be at least 8 characters long contain a number, a lowercase and an uppercase letter"
            onInput={passwordInputHandler}
          />
          {!isLoginMode && (
            <Input //TODO
              element="input"
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              validators={[
                VALIDATOR_MATCH_PASSWORD(formState.inputs.password.value),
              ]}
              errorText="Passwords do not match."
              ref={childRef}
              onInput={inputHandler}
            />
          )}
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
