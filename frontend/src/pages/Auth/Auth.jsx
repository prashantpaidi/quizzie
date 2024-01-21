import { Link, Outlet, useLocation } from 'react-router-dom';
import style from './Auth.module.css';

const Register = () => {
  let location = useLocation();
  return (
    <div className={style.body}>
      <div className={style.container}>
        <h2>QUIZZIE</h2>
        <div>
          <Link
            to={`/auth/register`}
            className={`${style.signUp} ${
              location.pathname === '/auth/register' ? style.active : ''
            }`}
          >
            Sign Up
          </Link>
          <Link
            to={`/auth/login`}
            className={`${style.signUp} ${
              location.pathname === '/auth/login' ? style.active : ''
            }`}
          >
            Login
          </Link>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Register;
