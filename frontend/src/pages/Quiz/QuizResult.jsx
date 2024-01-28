import { useLocation } from 'react-router-dom';
import styles from './QuizResult.module.css';
import trophyLogo from '../../assets/trophy.png';

export default function QuizResult() {
  const location = useLocation();
  const data = location.state;
  const { quizType } = data;
  let score, totalQuestion;

  if (quizType === 'Q & A') {
    ({ score, totalQuestion } = data);
  }

  console.log('data', data);

  return (
    <div className={styles.backGround}>
      <div className={styles.quizContainer}>
        {quizType === 'Q & A' ? (
          <div className={styles.congratsMessage}>
            Congrats Quiz is completed
            <img src={trophyLogo} alt='trophy' className={styles.trophyLogo} />
            <div>
              <span>Your Score is</span>
              <span className={styles.greenText}>
                {' 0'}
                {score} {' / 0'}
                {totalQuestion}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.pollText}>
            Thank you for participating in the Poll
          </div>
        )}
      </div>
    </div>
  );
}
