import { useEffect, useState } from 'react';
import styles from './QuizResponse.module.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function QuizResponse() {
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // user selected answer
  const [userAnswer, setUserAnswer] = useState({});
  useEffect(() => {
    const getQuiz = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/quizzes/${quizId}`
        );
        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setTimeout(() => navigate('/404'), 2000);
        } else {
          setQuiz(data);
          console.log('Quiz:data', data);
          console.log('Quiz:quiz', quiz);
        }
      } catch (error) {
        console.error(error);
        setError('Quiz not found');
        setTimeout(() => navigate('/404'), 2000);
      } finally {
        setLoading(false);
      }
    };
    getQuiz();
  }, [quizId]);

  useEffect(() => {
    setTimer();
  }, [quiz]);

  const setTimer = () => {
    if (quiz.timer === '5 Sec') setTimeRemaining(5);
    else if (quiz.timer === '10 Sec') setTimeRemaining(10);
    else setTimeRemaining(-1);
  };

  useEffect(() => {
    // Submit the quiz
    console.log('Quiz submitted with score: ', score);
    // submitQuiz user response
    const submitQuiz = async () => {
      try {
        navigate('/quiz-result', {
          state: {
            score: score,
            totalQuestion: quiz.questions.length,
            quizType: quiz.quizType,
          },
        });
        // convert userAnswer object to array
        const userAnswerArray = Object.keys(userAnswer).map((key) => ({
          questionId: key,
          selectedOptionId: userAnswer[key],
        }));
        // console.log('responses', userAnswerArray);
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/quizzes/submit`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quizId: quizId,
              userResponses: userAnswerArray,
            }),
          }
        );
        const data = await response.json();
        console.log('Quiz', data);
      } catch (error) {
        console.error(error);
      }
    };
    if (quizSubmitted) {
      submitQuiz();
    }

    // navigate to the next page
    // history.push(`/quizzes/response`);
  }, [quizSubmitted]);

  const handleNextClick = () => {
    if (
      quiz?.questions &&
      quiz.questions[currentQuestionIndex] &&
      userAnswer[quiz.questions[currentQuestionIndex]._id] ===
      quiz.questions[currentQuestionIndex].correctOptionId
    ) {
      setScore(score + 1);
    }
    if (quiz?.questions && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer();
    } else {
      if (!quizSubmitted) {
        console.log('debug', 1);
        setQuizSubmitted(true);
      }
    }
  };

  const handleOptionClick = (option) => {
    console.log('option', option);
    setUserAnswer({
      ...userAnswer,
      [quiz.questions[currentQuestionIndex]._id]: option._id,
    });

    // handleNextClick();
  };
  useEffect(() => {
    // Set up a timer interval to decrement timeRemaining every second
    if (quiz.type !== 'poll' && timeRemaining > 0) {
      const timerInterval = setInterval(() => {
        setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      // Clean up the timer interval when the component unmounts or the quiz ends
      return () => clearInterval(timerInterval);
    } else if (timeRemaining === 0) {
      //  move to next question when the timer reaches 0
      handleNextClick();
    }
  }, [timeRemaining]);

  const isLastQuestion =
    currentQuestionIndex === (quiz?.questions && quiz.questions.length - 1);
  const buttonText = isLastQuestion ? 'Submit' : 'Next';

  return (
    <div className={styles.backGround}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <p>Loading quiz...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <p>Redirecting...</p>
        </div>
      ) : (
        <div className={styles.quizContainer}>
          {/* question count */}
          <div className={styles.questionTimerContainer}>
            <div className={styles.questionCount}>
              <span>
                0{currentQuestionIndex + 1}/
                {`0${quiz?.questions && quiz?.questions.length}`}
              </span>
            </div>
            {quiz.timer !== 'OFF' && (
              <div className={styles.timer}>
                <span>00:0{timeRemaining}s</span>
              </div>
            )}
          </div>
          <div className={styles.questionOptionContainer}>
            {quiz?.questions && quiz.questions[currentQuestionIndex] && (
              <div>
                <h2 className={styles.title}>
                  {quiz.questions[currentQuestionIndex].text}
                </h2>
              </div>
            )}

            <div className={styles.optionContainer}>
              {quiz?.questions &&
                quiz.questions[currentQuestionIndex] &&
                quiz.questions[currentQuestionIndex].options &&
                quiz.questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div key={index} style={{ display: 'contents' }}>
                      {quiz.optionType === 'Text' ||
                        quiz.optionType === 'Text & Image URL' ? (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className={`${styles.optionText} ${userAnswer[
                              quiz.questions[currentQuestionIndex]._id
                            ] === option._id
                              ? styles.activeOption
                              : ''
                            }`}
                        >
                          <span
                            style={{
                              textAlign:
                                quiz.optionType === 'Text & Image URL'
                                  ? 'left'
                                  : 'inherit',
                            }}
                          >
                            {option.text}
                          </span>

                          {quiz.optionType === 'Text & Image URL' && (
                            <img
                              className={styles.optionImageWithText}
                              src={option.image}
                              alt='Option Image'
                            />
                          )}
                        </button>
                      ) : (
                        <img
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className={`${styles.optionOnlyImage} ${userAnswer[
                              quiz.questions[currentQuestionIndex]._id
                            ] === option._id
                              ? styles.activeOptionOnlyImage
                              : ''
                            }`}
                          src={option.image}
                          alt='Option Image'
                        />
                      )}
                    </div>
                  )
                )}
            </div>
          </div>
          <button onClick={handleNextClick} className={styles.nextButton}>
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
}
