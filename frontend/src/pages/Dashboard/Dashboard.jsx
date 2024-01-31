import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import EyeIcon from '../../assets/eyeIcon';

export default function Dashboard() {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [impressions, setImpressions] = useState(0);

  useEffect(() => {
    // get user id from local storage if no user id then redirect to login page
    const userId = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      navigate('/auth/register');
    }
    const getQuiz = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/quizzes/user/${userId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = await response.json();
        setQuizData(data.quizzes);
        setQuestionCount(data.questionCount);
        setImpressions(data.impressions);
        console.log('Quiz:data', data);
        console.log('Quiz:quiz', quizData);

        if (data.error) {
          alert(data.error);
        }
      } catch (error) {
        console.error(error);
        console.log('404');
        alert(error);
      }
    };
    getQuiz();
  }, []);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.cardContainer}>
        <div className={`${styles.card} ${styles.quizzesCount}`}>
          <div className={`${styles.cardWrapper}`}>
            <span className={`${styles.quizzesCountNumber}`}>
              {quizData?.length}
            </span>
            <span> Quiz</span>
            <span> Created</span>
          </div>
        </div>
        <div className={`${styles.card} ${styles.questionsCount}`}>
          <div className={`${styles.cardWrapper}`}>
            <span className={`${styles.questionsCountNumber}`}>
              {questionCount ? questionCount : 0}
            </span>
            <span> Questions</span>
            <span> Created</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.impressionsCount}`}>
          <div className={styles.cardWrapper}>
            <span className={styles.impressionsCountNumber}>
              {impressions >= 1000
                ? `${(Math.floor(impressions / 100) / 10).toFixed(1)}k`
                : impressions}
            </span>
            <span>Total Impressions</span>
          </div>
        </div>
      </div>
      <div className={styles.trendingQuizContainer}>
        <h1 className={styles.tileTrendingQuiz}>Trending Quiz</h1>
        {quizData?.length > 0 ? (
          <div className={styles.trendingQuizCardContainer}>
            {quizData?.map(
              (quiz, index) =>
                quiz.impressionCount > 10 && (
                  <div key={index} className={styles.trendingQuizCard}>
                    <div className={styles.quizTitleImpressionflex}>
                      <span className={styles.trendingQuizTitle}>
                        {quiz.title}
                      </span>
                      <span className={styles.trendingQuizImpressionCount}>
                        {quiz.impressionCount}
                      </span>
                      <span
                        className={styles.trendingQuizInfo}
                        style={{ marginTop: '5px' }}
                      >
                        <EyeIcon />
                      </span>
                    </div>
                    <span className={styles.quizCreatedAt}>
                      Created on : {new Date(quiz.created_at).getDate()}{' '}
                      {new Date(quiz.created_at).toLocaleString('en-US', {
                        month: 'short',
                      })}
                      {', '}
                      {new Date(quiz.created_at)
                        .getFullYear()
                        .toString()
                        .slice(-2)}
                    </span>
                  </div>
                )
            )}
          </div>
        ) : (
          <p>
            You haven&apos;t created any Quiz, Click on Create Quiz to create
            your first Quiz
          </p>
        )}
      </div>
      <Outlet />
    </div>
  );
}
