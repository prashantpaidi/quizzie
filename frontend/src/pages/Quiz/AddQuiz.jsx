import { useEffect, useState } from 'react';
import styles from './AddQuiz.module.css'; // Import the module style class
import { useNavigate } from 'react-router-dom';
import QuizTitleAndType from '../../component/Quiz/QuizTitleAndType';
import AddQuestions from '../../component/Quiz/AddQuestions';

export default function AddQuiz() {
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // login
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      navigate('/auth/login');
    }
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    questions: [
      {
        text: '',
        options: [
          { text: '', image: '' },
          { text: '', image: '' },
        ],
        correctOptionId: -1,
      },
    ],
    quizType: '',
    timer: 'OFF',
    optionType: 'Text',
    creatorId: '',
  });
  const [currentPage, setCurrentPage] = useState(-1);

  const handleChange = (event, questionIndex, optionIndex) => {
    const { name, value } = event.target;
    console.log(name, value);
    if (name === 'questionText') {
      const updatedQuestions = [...formData.questions];
      updatedQuestions[questionIndex].text = value;
      setFormData({
        ...formData,
        questions: updatedQuestions,
      });
    }

    if (name === 'text' || name === 'image') {
      // if optionIndex is undefined the question text
      const updatedQuestions = [...formData.questions];
      updatedQuestions[questionIndex].options[optionIndex] = {
        ...updatedQuestions[questionIndex].options[optionIndex],
        [name]: value,
      };

      setFormData({
        ...formData,
        questions: updatedQuestions,
      });
    } else if (name === 'correctOptionId') {
      console.log('correctOptionId', value);
      const updatedQuestions = [...formData.questions];
      updatedQuestions[questionIndex].correctOptionId = parseInt(value, 10);
      setFormData({
        ...formData,
        questions: updatedQuestions,
      });
    } else if (name === 'quizType') {
      // Add this condition to handle quizType
      setFormData({
        ...formData,
        quizType: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    console.log(formData);
  };

  const handleDeleteQuestion = (questionIndex) => {
    console.log('Delete question:', questionIndex);
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(questionIndex, 1);
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: '',
          options: [
            { text: '', image: '' },
            { text: '', image: '' },
          ],
          correctOptionId: -1,
        },
      ],
    });
  };

  const handleGotoAddQuestion = () => {
    let validationErrors = {};
    setErrors({});
    // validation quiz title
    if (!formData.title || formData.title === '') {
      validationErrors.title = 'Quiz title is required';
    }

    // validation quiz type
    if (!formData.quizType || formData.quizType === '') {
      validationErrors.quizType = 'Quiz type is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setCurrentPage(0);
  };
  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push({ text: '', image: '' });
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };
  const handleSubmit = async () => {
    console.log('Submit:', formData);
    let validationErrors = {};
    setErrors({});

    // validation quiz questions all question text should be filled
    for (let i = 0; i < formData.questions.length; i++) {
      console.log('formData', formData.questions[i].text);
      if (!formData.questions[i].text || formData.questions[i].text === '') {
        validationErrors.questionText = 'Question text is required';
      }
      // validation quiz questions all options text should be filled
      for (let j = 0; j < formData.questions[i].options.length; j++) {
        if (formData.optionType === 'Text') {
          delete formData.questions[i].options[j].image;
        }
        // if option type is image filter out text
        if (formData.optionType === 'Image URL') {
          delete formData.questions[i].options[j].text;
        }
        if (
          formData.optionType === 'Text' ||
          formData.optionType === 'Text & Image URL'
        ) {
          if (
            !formData.questions[i].options[j].text ||
            formData.questions[i].options[j].text === ''
          ) {
            validationErrors.optionText = 'Option text is required';
          }
        }
        if (
          formData.optionType === 'Image URL' ||
          formData.optionType === 'Text & Image URL'
        ) {
          if (
            !formData.questions[i].options[j].text ||
            formData.questions[i].options[j].text === ''
          ) {
            validationErrors.optionImage = 'Option Image URL is required';
          }
        }
      }
      console.log('formData', formData);
      // answer validation
      if (
        formData.quizType === 'Q & A' &&
        formData.questions[i].correctOptionId === -1
      ) {
        validationErrors.correctOptionId = 'Correct option is required';
      } else if (formData.quizType === 'Poll Type') {
        // remove correctOptionId from formData
        // delete formData.questions[i].correctOptionId;
        // null
        formData.questions[i].correctOptionId = null;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    formData.creatorId = localStorage.getItem('user');
    try {
      // Add your logic to make a POST request to the server endpoint
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/quizzes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Quiz added successfully:', data);
        navigate('/show-quiz-link', { state: { data: data } });
      } else {
        console.error('Failed to add quiz:', response.statusText);
        alert('Failed to add quiz');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add quiz');
    }
  };

  return (
    <div className={styles.backGround}>
      <div className={styles.quizContainer}>
        {currentPage === -1 ? (
          <QuizTitleAndType
            formData={formData}
            handleChange={handleChange}
            handleAddQuestion={handleGotoAddQuestion}
            navigateBack={() => navigate(-1)}
            errors={errors}
          />
        ) : (
          <AddQuestions
            formData={formData}
            currentPage={currentPage}
            handleChange={handleChange}
            handleAddQuestion={handleAddQuestion}
            handleSubmit={handleSubmit}
            navigateBack={() => navigate(-1)}
            setCurrentPage={setCurrentPage}
            handleDeleteQuestion={handleDeleteQuestion}
            handleAddOption={handleAddOption}
            errors={errors}
          />
        )}
      </div>
    </div>
  );
}
