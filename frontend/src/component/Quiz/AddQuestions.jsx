
import styles from './AddQuiz.module.css';
import PropTypes from 'prop-types';
import DeleteIcon from '../../assets/deleteIcon.svg';
const AddQuestions = ({
  formData,
  currentPage,
  handleChange,
  handleAddQuestion,
  handleSubmit,
  navigateBack,
  setCurrentPage,
  handleDeleteQuestion,
  handleAddOption,
  errors,
  edit,
  handleEditSubmit,
  handleDeleteOption,
  setQuestions,
}) => {
  return (
    <>
      <div className={styles.flexSpaceBetween}>
        <div className={styles.questionIconList}>
          {formData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className={styles.questionContainer}>
              {questionIndex > 0 && (
                <span
                  className={styles.deleteButton}
                  onClick={() => handleDeleteQuestion(questionIndex)}
                >
                  x
                </span>
              )}
              <button
                onClick={() => setCurrentPage(questionIndex)}
                className={`${styles.questionIcon} ${
                  questionIndex === currentPage ? styles.questionIconActive : ''
                }`}
              >
                {questionIndex + 1}
              </button>
            </div>
          ))}
          {formData.questions.length < 5 && (
            <svg
              width={25}
              height={25}
              viewBox='0 0 25 25'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              onClick={handleAddQuestion}
            >
              <path
                d='M24.5 14H14V24.5H10.5V14H0V10.5H10.5V0H14V10.5H24.5V14Z'
                fill='#969696'
              />
            </svg>
          )}
        </div>
        <span>Max 5 Questions</span>
      </div>
      <div
        key={currentPage}
        // style={{
        //   display: questionIndex === currentPage ? 'block' : 'none',
        // }}
        className={styles.questionContainer}
      >
        <input
          type='text'
          name='questionText'
          value={formData.questions[currentPage]?.text || ''}
          onChange={(e) => handleChange(e, currentPage)}
          style={{ width: '100%' }}
          className={styles.questionInput}
        />
        <div className={styles.flexSpaceAround}>
          <label>Option Type:</label>
          <div>
            <input
              type='radio'
              id='textOption'
              name='optionType'
              value='Text'
              checked={formData.optionType === 'Text'}
              onChange={(e) => handleChange(e)}
              key={formData.optionType}
            />
            <label htmlFor='textOption'>Text</label>
          </div>
          <div>
            <input
              type='radio'
              id='imageOption'
              name='optionType'
              value='Image URL'
              checked={formData.optionType === 'Image URL'}
              onChange={(e) => handleChange(e)}
              key={formData.optionType}
            />
            <label htmlFor='imageOption'>Image URL</label>
          </div>
          <div>
            <input
              type='radio'
              id='textAndImageOption'
              name='optionType'
              value='Text & Image URL'
              checked={formData.optionType === 'Text & Image URL'}
              onChange={(e) => handleChange(e)}
              key={formData.optionType}
            />
            <label htmlFor='textAndImageOption'>Text & Image URL</label>
          </div>
        </div>

        <div className={styles.optionTimerContainer}>
          <div className={styles.optionContainer}>
            {/* {formData.questions.map((question, questionIndex) => */}
            {formData.questions[currentPage]?.options?.map(
              (option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={styles.optionWarpper}
                  // style={{
                  //   display: questionIndex === currentPage ? 'block' : 'none',
                  // }}
                >
                  {formData.quizType === 'Q & A' && (
                    <input
                      type='radio'
                      name='correctOptionId'
                      value={optionIndex}
                      checked={
                        formData.questions[currentPage]?.correctOptionId ===
                        optionIndex
                      }
                      onChange={(e) =>
                        handleChange(e, currentPage, optionIndex)
                      }
                      className={styles.optionRadioButton}
                    />
                  )}
                  {formData.optionType !== 'Image URL' && (
                    <>
                      <input
                        type='text'
                        name='text'
                        value={option.text}
                        onChange={(e) =>
                          handleChange(e, currentPage, optionIndex)
                        }
                        placeholder='Text'
                        className={`${styles.optionInput} ${
                          formData.questions[currentPage]?.correctOptionId ===
                          optionIndex
                            ? styles.activeInput
                            : ''
                        }`}
                        style={{
                          width:
                            formData.optionType === 'Text & Image URL'
                              ? '20%'
                              : '40%',
                        }}
                      />
                    </>
                  )}
                  {(formData.optionType === 'Text & Image URL' ||
                    formData.optionType === 'Image URL') && (
                    <>
                      <input
                        type='text'
                        name='image'
                        value={option.image}
                        onChange={(e) =>
                          handleChange(e, currentPage, optionIndex)
                        }
                        placeholder='Image URL'
                        className={`${styles.optionInput} ${
                          formData.questions[currentPage]?.correctOptionId ===
                          optionIndex
                            ? styles.activeInput
                            : ''
                        }`}
                        style={{
                          width:
                            formData.optionType === 'Text & Image URL'
                              ? '30%'
                              : '40%',
                        }}
                      />
                    </>
                  )}
                  {optionIndex > 1 && (
                    <img
                      src={DeleteIcon}
                      onClick={() =>
                        handleDeleteOption(currentPage, optionIndex)
                      }
                    />
                  )}
                </div>
              )
            )}
            {/* )}  */}

            {formData.questions[currentPage]?.options.length < 4 && (
              <button
                onClick={() => handleAddOption(currentPage)}
                className={`${styles.addOptionsButton} ${styles.quizButton}`}
              >
                + Add Option
              </button>
            )}
          </div>

          {formData.quizType === 'Q & A' && (
            <div className={styles.timerContainer}>
              <label className={styles.label} htmlFor='timer'>
                Timer
              </label>
              <button
                id='timer'
                name='timer'
                value='OFF'
                onClick={(e) => handleChange(e)}
                className={`${styles.timerButton} ${
                  formData.timer === 'OFF' ? styles.timerButtonActive : ''
                }`}
              >
                OFF
              </button>
              <button
                id='timer'
                name='timer'
                value='5 Sec'
                onClick={(e) => handleChange(e)}
                className={`${styles.timerButton} ${
                  formData.timer === '5 Sec' ? styles.timerButtonActive : ''
                }`}
              >
                5 sec
              </button>
              <button
                id='timer'
                name='timer'
                value='10 sec'
                onClick={(e) => handleChange(e)}
                className={`${styles.timerButton} ${
                  formData.timer === '10 Sec' ? styles.timerButtonActive : ''
                }`}
              >
                10 sec
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='error'>
        {Object.keys(errors).map((key, index) => (
          <p key={index}>{errors[key]}</p>
        ))}
      </div>

      <div
        className={`${styles.flexSpaceBetween} ${styles.submitButtonContainer}`}
      >
        <button
          key='Cancel'
          onClick={() => navigateBack()}
          className={`${styles.quizButton} ${styles.mainButton}`}
        >
          Cancel
        </button>

        {!edit ? (
          <button
            key='MoveToQuestionPage'
            onClick={() => handleSubmit()}
            className={`${styles.quizButton} ${styles.mainButton} ${styles.mainButtonActive}`}
          >
            Create Quiz
          </button>
        ) : (
          <button
            key='DeleteQuestion'
            onClick={() => handleEditSubmit()}
            className={`${styles.quizButton} ${styles.mainButton}`}
          >
            Edit
          </button>
        )}
      </div>
    </>
  );
};

AddQuestions.propTypes = {
  formData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
            image: PropTypes.string,
          })
        ).isRequired,
        correctOptionId: PropTypes.number.isRequired,
      })
    ).isRequired,
    optionType: PropTypes.string.isRequired,
    timer: PropTypes.string.isRequired,
    quizType: PropTypes.string.isRequired,
    creatorId: PropTypes.string.isRequired,
  }).isRequired,
  currentPage: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleAddQuestion: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  navigateBack: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  handleDeleteQuestion: PropTypes.func.isRequired,
  handleAddOption: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    correctOptionId: PropTypes.string,
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  handleEditSubmit: PropTypes.func.isRequired,
  handleDeleteOption: PropTypes.func.isRequired,
  setQuestions: PropTypes.func.isRequired,
};
export default AddQuestions;
