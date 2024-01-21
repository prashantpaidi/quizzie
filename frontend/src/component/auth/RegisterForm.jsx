import { useState } from 'react';
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

  async function handleSubmit() {
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

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log(responseData);
      localStorage.setItem('name', responseData.name);
      localStorage.setItem('email', responseData.email);
      localStorage.setItem('token', responseData.token);
      navigate('/');
    } catch (error) {
      console.log(error);
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
          placeholder='Name'
          className={`${styles.register_input} ${
            errors.serverErr ? styles.errorMsg : ''
          }`}
          name='name'
          onChange={(e) => handleChange(e)}
          value={registerData.name}
        ></input>
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
          type='email'
          placeholder='Email'
          className={`${styles.register_input} ${
            errors.serverErr ? styles.errorMsg : ''
          }`}
          name='email'
          onChange={(e) => handleChange(e)}
          value={registerData.email}
        ></input>
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
          placeholder='Password'
          className={`${styles.register_input} ${
            errors.serverErr ? styles.errorMsg : ''
          }`}
          name='password'
          onChange={(e) => handleChange(e)}
          value={registerData.password}
          style={{ marginTop: '0.7rem' }}
        ></input>
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
          placeholder='Confirm Password'
          className={`${styles.register_input} ${
            errors.serverErr ? styles.errorMsg : ''
          }`}
          name='confirmPassword'
          onChange={(e) => handleChange(e)}
          value={registerData.confirmPassword}
          style={{ marginTop: '0.7rem' }}
        ></input>
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
