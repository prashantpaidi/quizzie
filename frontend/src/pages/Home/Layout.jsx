import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import style from './Layout.module.css';
import { useState } from 'react';

export default function Layout() {
  let location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('token') !== null
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/auth/login');
  };

  return (
    <div className={style.mainContainer}>
      <div className={style.sideBar}>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <div className={style.logo}>QUIZZIE</div>
        </Link>
        <div className={style.modesContainer}>
          <Link
            to='/'
            className={`${style.activeBtn} ${
              location.pathname === '/' ? style.activeScreen : ''
            }`}
          >
            Dashboard
          </Link>
          <Link
            to='/analytics'
            className={`${style.activeBtn} ${
              location.pathname === '/analytics' ? style.activeScreen : ''
            }`}
          >
            Analytics
          </Link>
          <Link
            to='/add-quiz'
            className={`${style.activeBtn} ${
              location.pathname === '/create-quiz' ? style.activeScreen : ''
            }`}
          >
            Create Quiz
          </Link>
        </div>
        <hr />
        <button
          className={style.logoutBtn}
          style={{ marginTop: '10px' }}
          onClick={isLoggedIn ? handleLogout : () => navigate('/')}
        >
          {isLoggedIn ? 'LOGOUT' : 'LOG IN'}
        </button>
      </div>
      <Outlet />
    </div>
  );
}
