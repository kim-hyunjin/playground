import useInput from '../hooks/useInput';
import useInputReducer from '../hooks/useInputReducer';

const isNotEmpty = (value) => value.trim() !== '';
const isEmail = (value) => value.includes('@');

const BasicForm = (props) => {
  const firstNameInput = useInput(isNotEmpty);
  const lastNameInput = useInput(isNotEmpty);
  const emailInput = useInputReducer(isEmail);

  const formIsValid = firstNameInput.isValid && lastNameInput.isValid && emailInput.isValid;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!formIsValid) return;

    console.log('submitted');
    console.log(firstNameInput.value, lastNameInput.value, emailInput.value);

    firstNameInput.reset();
    lastNameInput.reset();
    emailInput.reset();
  };

  const firstNameClasses = firstNameInput.hasError ? 'form-control invalid' : 'form-control';
  const lastNameClasses = lastNameInput.hasError ? 'form-control invalid' : 'form-control';
  const emailClasses = emailInput.hasError ? 'form-control invalid' : 'form-control';

  return (
    <form onSubmit={submitHandler}>
      <div className='control-group'>
        <div className={firstNameClasses}>
          <label htmlFor='name'>First Name</label>
          <input
            type='text'
            id='name'
            onChange={firstNameInput.valueChangeHandler}
            onBlur={firstNameInput.inputBlurHandler}
            value={firstNameInput.value}
          />
          {firstNameInput.hasError && <p className='error-text'>Please enter a first name.</p>}
        </div>
        <div className={lastNameClasses}>
          <label htmlFor='name'>Last Name</label>
          <input
            type='text'
            id='name'
            onChange={lastNameInput.valueChangeHandler}
            onBlur={lastNameInput.inputBlurHandler}
            value={lastNameInput.value}
          />
          {lastNameInput.hasError && <p className='error-text'>Please enter a last name.</p>}
        </div>
      </div>
      <div className={emailClasses}>
        <label htmlFor='name'>E-Mail Address</label>
        <input
          type='text'
          id='name'
          onChange={emailInput.valueChangeHandler}
          onBlur={emailInput.inputBlurHandler}
          value={emailInput.value}
        />
        {emailInput.hasError && <p className='error-text'>Please enter a valid email.</p>}
      </div>
      <div className='form-actions'>
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};

export default BasicForm;
