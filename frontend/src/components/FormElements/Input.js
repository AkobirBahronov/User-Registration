import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
} from 'react';

import './Input.css';
import { VALIDATOR_MATCH_PASSWORD, validate } from '../../util/validators';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    case 'VALIDATE_CONFIRM_PASSWORD':
      return {
        ...state,
        isValid: validate(state.value, [
          VALIDATOR_MATCH_PASSWORD(action.originalPassword),
        ]),
      };
    default:
      return state;
  }
};

const Input = forwardRef((props, ref) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useImperativeHandle(ref, () => ({
    validateConfirmPassword(originalPassword) {
      dispatch({
        type: 'VALIDATE_CONFIRM_PASSWORD',
        validators: props.validators,
        originalPassword,
      });
    },
  }));

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: 'TOUCH' });
  };

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
});

export default Input;
