import { Link, useNavigate } from 'react-router-dom';
import styles from './Analytics.module.css';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import deleteIcon from '../../assets/deleteIcon.svg';
import editIcon from '../../assets/editIcon.svg';
import shareIcon from '../../assets/shareIcon.svg';
import DeleteModal from '../../component/Quiz/DeleteModal';

export default function Analytics() {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState([]);
  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  useEffect(() => {
    // get user id from local storage if no user id then redirect to login page
    const userId = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      navigate('/auth/login');
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
        console.log('Quiz:data', data);
        console.log('Quiz:quiz', quizData);

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

  const handleShareClick = (quizId) => {
    {
      navigator.clipboard.writeText(
        `${import.meta.env.VITE_APP_WEB_URL}/quiz/${quizId}`
      );
    }
    toast.success('Copied to clipboard');
  };

  const handleDeleteClick = async (quizId) => {
    setQuizToDelete(quizId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    const quizId = quizToDelete;

    if (!quizId) return console.log('No quiz id');
    const userId = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      navigate('/auth/login');
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/quizzes/${quizId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const data = await response.json();
      console.log('data', data);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        const newQuizData = quizData.filter((quiz) => quiz._id !== quizId);
        setQuizData(newQuizData);
      }

      setQuizToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      alert('Something went wrong');
      console.error(error);
    }
  };

  const handleEditClick = (quizId) => {
    navigate(`/add-quiz/`, {
      state: { id: quizId, edit: true },
    });
  };

  return (
    <div className={styles.analyticsTableContainer}>
      <div className={styles.analyticsTableWrapper}>
        <h1 className={styles.analyticsTitle}>Quiz Analytics</h1>
        <table className={styles.analyticsTable}>
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Quiz Name</th>
              <th>Created on</th>
              <th>Impression</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quizData.map((quiz, index) => (
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>
                  {new Date(quiz.created_at).getDate()}{' '}
                  {new Date(quiz.created_at).toLocaleString('en-US', {
                    month: 'short',
                  })}
                  {', '}
                  {new Date(quiz.created_at).getFullYear().toString().slice(-2)}
                </td>
                <td>
                  {quiz.impressionCount >= 1000
                    ? `${(Math.floor(quiz.impressionCount / 100) / 10).toFixed(
                        1
                      )}k`
                    : quiz.impressionCount}
                </td>
                <td>
                  <img
                    src={editIcon}
                    onClick={() => handleEditClick(quiz._id)}
                  />
                  <img
                    src={deleteIcon}
                    onClick={() => handleDeleteClick(quiz._id)}
                  />
                  <img
                    src={shareIcon}
                    onClick={() => handleShareClick(quiz._id)}
                  />
                </td>
                <td>
                  <Link
                    to={`${import.meta.env.VITE_APP_WEB_URL}/quiz/analytics/${
                      quiz._id
                    }`}
                  >
                    Question Wise Analysis
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDeleteModal ? (
        <DeleteModal
          handleDeleteConfirm={handleDeleteConfirm}
          setShowDeleteModal={setShowDeleteModal}
        />
      ) : null}
      <Toaster position='top-right' />
    </div>
  );
}
