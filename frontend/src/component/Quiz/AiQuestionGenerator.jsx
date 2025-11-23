import React, { useState } from 'react';
import styles from './AddQuiz.module.css';

const AiQuestionGenerator = ({
  setQuestions,
  title,
  quizType,
  handleAddQuestion,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQuestions = async () => {
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
          body: JSON.stringify({ title, quizType }),
        }
      );
      const data = await response.json();
      const transformedQuestions = data.questions.map((q) => ({
        text: q.question,
        options: q.options.map((opt) => ({ text: opt, image: '' })),
        correctOptionId: q.options.indexOf(q.answer),
      }));
      setQuestions(transformedQuestions);
      handleAddQuestion();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.aiGenerator}>
      <button
        type="button"
        className={styles.aiButton}
        onClick={handleGenerateQuestions}
        disabled={isLoading || !title}
      >
        {isLoading ? 'Generating...' : 'Generate with AI'}
      </button>
    </div>
  );
};

export default AiQuestionGenerator;
