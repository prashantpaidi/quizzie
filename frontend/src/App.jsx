import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageNotFound from './pages/Home/PageNotFound';
import RegisterForm from './component/auth/RegisterForm';
import LoginForm from './component/auth/LoginForm';
import Auth from './pages/Auth/Auth';
import Dashboard from './pages/Dashboard/Dashboard';
import Layout from './pages/Home/Layout';
import AddQuiz from './pages/Quiz/AddQuiz';
import QuizLink from './pages/Quiz/QuizLink';
import QuizResponse from './pages/Quiz/QuizResponse';
import QuizResult from './pages/Quiz/QuizResult';
import Analytics from './pages/Analytics/Analytics';
import QuestionAnalysis from './pages/Analytics/QuestionAnalysis';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/auth' element={<Auth />}>
            <Route path='/auth/register' element={<RegisterForm />} />
            <Route path='/auth/login' element={<LoginForm />} />
          </Route>
          <Route path='/' element={<Layout />}>
            <Route path='/analytics' element={<Analytics />} />
            <Route
              path='/quiz/analytics/:quizId'
              element={<QuestionAnalysis />}
            />
            <Route path='/' element={<Dashboard />}>
              <Route path='/add-quiz' element={<AddQuiz />} />
              <Route path='/show-quiz-link' element={<QuizLink />} />
            </Route>
          </Route>
          <Route path='/quiz/:quizId' element={<QuizResponse />} />
          <Route path='/quiz-result' element={<QuizResult />} />
          <Route path='/404' element={<PageNotFound />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
