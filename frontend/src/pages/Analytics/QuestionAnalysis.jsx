import { useEffect, useState } from 'react';
import styles from './QuestionAnalysis.module.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function QuestionAnalysis() {
  // currQuiz
  const [currQuiz, setCurrQuiz] = useState(null);

  // get quiz id from params
  const { quizId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    // get user id from local storage if no user id then redirect to login page
    const userId = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      navigate('/auth/login');
    }

    // fetch quiz data from backend
    const getQuiz = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/quizzes/analytics/${quizId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = await response.json();
        setCurrQuiz(data.analytics);
        console.log('Quiz:data', data);

        if (data.error) {
          alert('Something went wrong');
        }
      } catch (error) {
        console.error(error);
        console.log('404');
        alert('Something went wrong');
      }
    };
    getQuiz();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1 className={styles.heading}>{currQuiz?.title} Question Analysis</h1>
        <div className={styles.quiz_data}>
          <div className={styles.created_on}>
            Created on : {new Date(currQuiz?.createdOn).getDate()}{' '}
            {new Date(currQuiz?.createdOn).toLocaleString('en-US', {
              month: 'short',
            })}
            {', '}
            {new Date(currQuiz?.createdOn).getFullYear().toString().slice(-2)}
          </div>
          <div className={styles.impressions}>
            Impressions : {currQuiz?.impressionCount}
          </div>
        </div>
      </div>
      <div className={styles.quizConainer}>
        {currQuiz?.questions &&
          currQuiz.questions.map((question, index) => (
            <div key={index} className={styles.question_container}>
              <div className={styles.question}>
                Q.{index + 1} {question.text}
              </div>
              <div className={styles.optionContainer}>
                {currQuiz.quizType === 'Q & A' ? (
                  <>
                    <div className={styles.optionCard}>
                      <span className={styles.responseCount}>
                        {question.totalResponses}
                      </span>
                      <span className={styles.responseDescription}>
                        people Attempted the question
                      </span>
                    </div>
                    <div className={styles.optionCard}>
                      <span className={styles.responseCount}>
                        {question.totalRight}
                      </span>
                      <span className={styles.responseDescription}>
                        people Answered Correctly
                      </span>
                    </div>
                    <div className={styles.optionCard}>
                      <span className={styles.responseCount}>
                        {question.totalWrong}
                      </span>
                      <span className={styles.responseDescription}>
                        people Answered Incorrectly
                      </span>
                    </div>
                  </>
                ) : (
                  question?.options &&
                  question.options.map((option, index) => (
                    <div
                      className={styles.optionCard}
                      style={{
                        width: '18%',
                        flexDirection: 'row',
                        gap: '1.2rem',
                      }}
                      key={index}
                    >
                      <span className={styles.responseCount}>
                        {option.totalResponses}
                      </span>
                      <span>Option {index + 1}</span>
                    </div>
                  ))
                )}
              </div>
              <hr />
            </div>
          ))}
      </div>
    </div>
  );
}
