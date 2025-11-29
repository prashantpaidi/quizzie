import styles from './QuizTitleAndType.module.css';
import PropTypes from 'prop-types';
import AiQuestionGenerator from './AiQuestionGenerator';

const QuizTitleAndType = ({
  formData,
  handleChange,
  handleAddQuestion,
  navigateBack,
  errors,
  setQuestions,
}) => {
  return (
    <>
      <input
        style={{ width: '70%' }}
        className={styles.quizInput}
        type='text'
        name='title'
        value={formData?.title}
        onChange={(e) => handleChange(e)}
        placeholder='Quiz name'
      />
      {errors.title && <p className={styles.error}>{errors.title}</p>}
      <div className={styles.inputContainer}>
        <label className={styles.quizLabel}>Quiz Type:</label>
        <button
          type='button'
          name='quizType'
          value='Q & A'
          onClick={(e) => handleChange(e)}
          className={
            formData.quizType === 'Q & A'
              ? `${styles.quizButton} ${styles.quizButtonActive}`
              : styles.quizButton
          }
        >
          Q & A
        </button>
        <button
          type='button'
          name='quizType'
          value='Poll Type'
          onClick={(e) => handleChange(e)}
          className={`${styles.quizButton} ${
            formData.quizType === 'Poll Type' ? styles.quizButtonActive : ''
          }`}
        >
          Poll Type
        </button>
      </div>
      {errors.quizType && <p className={styles.error}>{errors.quizType}</p>}
      <div className={styles.inputContainer}>
        <div className={styles.flex}>
        <button
          key='Cancel'
          onClick={() => navigateBack()}
          className={`${styles.quizButton} ${styles.mainButton}`}
        >
          Cancel
        </button>
          <button
            key='MoveToQuestionPage'
            onClick={() => handleAddQuestion()}
            className={`${styles.quizButton} ${styles.mainButton} ${styles.mainButtonActive}`}
          >
            Continue
          </button>
          <AiQuestionGenerator
            setQuestions={setQuestions}
            title={formData.title}
            quizType={formData.quizType}
            handleAddQuestion={handleAddQuestion}
          />
        </div>
      </div>
    </>
  );
};
QuizTitleAndType.propTypes = {
  formData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    quizType: PropTypes.string.isRequired, // Add this line
    // Add other properties of formData here
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleAddQuestion: PropTypes.func.isRequired,
  navigateBack: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    quizType: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  setQuestions: PropTypes.func.isRequired,
};
export default QuizTitleAndType;
