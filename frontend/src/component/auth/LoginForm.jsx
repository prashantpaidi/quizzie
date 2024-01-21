import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    emailErr: false,
    passwordErr: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      const formData = new URLSearchParams();
      formData.append('email', loginData.email);
      formData.append('password', loginData.password);

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      console.log(responseData);
      localStorage.setItem('name', responseData.user.name);
      localStorage.setItem('email', responseData.user.email);
      localStorage.setItem('token', responseData.token);
      navigate('/');
    } catch (error) {
      console.log(error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        serverErr: true,
      }));
    }
  };
  return (
    <>
      <div className={styles.login_container}>
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
            className={`${styles.login_input} ${
              errors.serverErr ? styles.errorMsg : ''
            }`}
            name='email'
            onChange={(e) => handleChange(e)}
            value={loginData.email}
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
            className={`${styles.login_input} ${
              errors.serverErr ? styles.errorMsg : ''
            }`}
            name='password'
            onChange={(e) => handleChange(e)}
            value={loginData.password}
            style={{ marginTop: '0.7rem' }}
          ></input>
        </div>
        <button className={styles.login_btn} onClick={() => handleSubmit()}>
          Sign in
        </button>
      </div>
    </>
  );
}
