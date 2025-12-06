import styles from './QuizTitleAndType.module.css';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const QuizTitleAndType = ({
  formData,
  handleChange,
  handleAddQuestion,
  navigateBack,
  errors,
  setQuestions,
  isEditing = false,
}) => {
  const selectCreationMethod = (value) => {
    // mimic an event object expected by handleChange for creation method
    handleChange({ target: { name: 'creationMethod', value } });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleContinueClick = async () => {
    // If AI is selected, call the generation endpoint, set questions, then navigate
    if (formData.creationMethod === 'AI') {
      if (!formData.title) return; // require title
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/quizzes/generate-questions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem('token'),
            },
            body: JSON.stringify({ title: formData.title, quizType: formData.quizType }),
          }
        );
        const data = await response.json();
        const transformedQuestions = (data.questions || []).map((q) => ({
          text: q.question,
          options: q.options.map((opt) => ({ text: opt, image: '' })),
          correctOptionId: q.options.indexOf(q.answer),
        }));
        setQuestions(transformedQuestions);
        handleAddQuestion();
      } catch (error) {
        console.error('AI generation failed', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Manual or other creation methods simply continue
      handleAddQuestion();
    }
  };

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

      {!isEditing && (
        <>
          <div className={styles.subLabel}>Select Creation Method:</div>
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
          <div className={styles.cardGrid}>
            <div
              role='button'
              tabIndex={0}
              className={`${styles.card} ${
                formData.creationMethod === 'Manual' ? styles.cardActive : ''
              }`}
              onClick={() => {
                selectCreationMethod('Manual');
                handleAddQuestion();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  selectCreationMethod('Manual');
                  handleAddQuestion();
                }
              }}
            >
              <div className={styles.cardIcon}>✏️</div>
              <div className={styles.cardTitle}>Manual</div>
              <div className={styles.cardSub}>Create questions yourself</div>
            </div>

            <div
              role='button'
              tabIndex={0}
              className={`${styles.card} ${
                formData.creationMethod === 'AI' ? styles.cardActive : ''
              }`}
              onClick={() => selectCreationMethod('AI')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') selectCreationMethod('AI');
              }}
            >
              <div className={styles.cardIcon}>✨</div>
              <div className={styles.cardTitle}>AI Generate</div>
              <div className={styles.cardSub}>Let AI create questions for you</div>
              {/* AI generation moved to Continue button; no inline generator here */}
            </div>
          </div>
        </>
      )}

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
            key='Continue'
            onClick={handleContinueClick}
            disabled={isLoading || (formData.creationMethod === 'AI' && !formData.title)}
            className={`${styles.quizButton} ${styles.mainButton} ${styles.mainButtonActive}`}
          >
            {isLoading && formData.creationMethod === 'AI' ? 'Generating...' : 'Continue'}
          </button>
        </div>
      </div>
    </>
  );
};

QuizTitleAndType.propTypes = {
  formData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    quizType: PropTypes.string.isRequired,
    creationMethod: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleAddQuestion: PropTypes.func.isRequired,
  navigateBack: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    quizType: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  setQuestions: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};

export default QuizTitleAndType;
