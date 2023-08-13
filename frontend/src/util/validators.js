const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_MATCH_PASSWORD = 'MATCH_PASSWORD';
const VALIDATOR_TYPE_HAS_LOWER_CASE = 'HAS_LOWER_CASE';
const VALIDATOR_TYPE_HAS_UPPER_CASE = 'HAS_UPPER_CASE';
const VALIDATOR_TYPE_HAS_NUMBERS = 'HAS_NUMBERS';

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_MINLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val,
});
export const VALIDATOR_MAXLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val,
});
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });

export const VALIDATOR_HAS_LOWER_CASE = () => ({
  type: VALIDATOR_TYPE_HAS_LOWER_CASE,
});

export const VALIDATOR_HAS_UPPER_CASE = () => ({
  type: VALIDATOR_TYPE_HAS_UPPER_CASE,
});

export const VALIDATOR_HAS_NUMBERS = () => ({
  type: VALIDATOR_TYPE_HAS_NUMBERS,
});

export const VALIDATOR_MATCH_PASSWORD = (val) => ({
  type: VALIDATOR_TYPE_MATCH_PASSWORD,
  val: val,
});

export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MATCH_PASSWORD) {
      isValid = isValid && value.trim() === validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_HAS_LOWER_CASE) {
      isValid = isValid && /[a-z]/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_HAS_UPPER_CASE) {
      isValid = isValid && /[A-Z]/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_HAS_NUMBERS) {
      isValid = isValid && /[0-9]/.test(value);
    }
  }
  return isValid;
};
