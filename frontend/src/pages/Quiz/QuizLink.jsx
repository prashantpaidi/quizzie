import { useLocation, useNavigate } from 'react-router-dom';
import styles from './QuizLink.module.css';
import toast, { Toaster } from 'react-hot-toast';

export default function QuizLink() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  console.log('data', data);

  const handleSubmit = () => {
    // handle submit logic here
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_APP_WEB_URL}/quiz/${data.data.quizId}`
    );
    toast.success('Copied to clipboard');
  };

  return (
    <div className={styles.backGround}>
      <div className={styles.quizContainer}>
        <span
          className={styles.closeButton}
          onClick={() => {
            navigate('/');
          }}
        >
          &times;
        </span>
        <h2 className={styles.heading}>Congrats your Quiz is Published!</h2>
        <input
          type='text'
          placeholder='Enter quiz link'
          value={`${import.meta.env.VITE_APP_WEB_URL}/quiz/${data.data.quizId}`}
          readOnly // make the input field unchangeable
          className={styles.input}
        />
        <button onClick={handleSubmit} className={styles.button}>
          Share
        </button>
      </div>
      <Toaster position='top-right' />
    </div>
  );
}
