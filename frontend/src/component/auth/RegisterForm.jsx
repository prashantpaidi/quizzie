import { useEffect, useState } from 'react';
import styles from './RegisterForm.module.css';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    serverErr: false,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function validate() {
    const { name, email, password, confirmPassword } = registerData;
    const errors = {};
    if (!name) {
      errors.invalidName = true;
    }
    if (!email || !email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
      errors.invalidEmail = true;
    }
    // password number and special character validation
    if (!password || password.length < 6) {
      errors.invalidPassword = 'Please enter your password';
    }
    if (!confirmPassword) {
      errors.invalidConfirmPassword = 'Please confirm your password';
    }
    if (password !== confirmPassword) {
      errors.passwordMismatch = 'Passwords do not match';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...errors,
    }));
    return Object.keys(errors).length === 0;
  }
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  async function handleSubmit() {
    // handle validation
    if (!validate()) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        }
      );

      console.log(response);
      if (response.status === 400) {
        throw new Error('Email is already registered');
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log(responseData);
      localStorage.setItem('name', responseData.name);
      localStorage.setItem('email', responseData.email);
      localStorage.setItem('user', responseData.id);
      localStorage.setItem('token', responseData.token);
      navigate('/');
    } catch (error) {
      console.log(error);
      alert(error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        serverErr: true,
      }));
    }
  }
  return (
    <div className={styles.register_container}>
      <div className={styles.input_wrapper}>
        <label
          htmlFor='name'
          className={styles.label}
          style={{ marginRight: '0.7rem' }}
        >
          Name
        </label>
        <input
          type='text'
          placeholder={errors.invalidName ? 'Invalid name' : 'Enter your name'}
          className={`${styles.register_input} ${
            errors.serverErr ? styles.errorMsg : ''
          }${errors.invalidName ? styles.errorMsg : ''}`}
          name='name'
          onChange={(e) => handleChange(e)}
          value={registerData.name}
        />
      </div>
      <div className={styles.input_wrapper}>
        <label
          htmlFor='email'
          className={styles.label}
          style={{ marginRight: '0.7rem' }}
        >
          Email
        </label>
        <input
          type='text'
          placeholder={
            errors.invalidName ? 'Invalid Email' : 'Enter your Email'
          }
          className={`${styles.register_input} ${
            errors.serverErr ? styles.errorMsg : ''
          }${errors.invalidEmail ? styles.errorMsg : ''}`}
          name='email'
          onChange={(e) => handleChange(e)}
          value={registerData.email}
        />
      </div>

      <div className={styles.input_wrapper}>
        <label
          htmlFor='password'
          className={styles.label}
          style={{ marginRight: '0.7rem' }}
        >
          Password
        </label>
        <input
          type='password'
          placeholder={errors.invalidName ? 'Invalid name' : 'Enter your name'}
          className={`${styles.register_input} ${
            errors.serverErr ? styles.errorMsg : ''
          }${errors.invalidPassword ? styles.errorMsg : ''}`}
          name='password'
          onChange={(e) => handleChange(e)}
          value={registerData.password}
        />
      </div>
      <div className={styles.input_wrapper}>
        <label
          htmlFor='confirmPassword'
          className={styles.label}
          style={{ marginRight: '0.7rem' }}
        >
          Confirm Password
        </label>
        <input
          type='password'
          placeholder={errors.invalidName ? 'Invalid name' : 'Enter your name'}
          className={`${styles.register_input} ${
            errors.serverErr ? styles.errorMsg : ''
          }${errors.passwordMismatch ? styles.errorMsg : ''}`}
          name='confirmPassword'
          onChange={(e) => handleChange(e)}
          value={registerData.confirmPassword}
        />
      </div>

      <button className={styles.register_btn} onClick={() => handleSubmit()}>
        Sign up
      </button>
      {errors.serverErr && (
        <div className={styles.errorMsg}>
          An error occurred. Please try again.
        </div>
      )}
    </div>
  );
}
