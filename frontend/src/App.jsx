import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load all route components
const PageNotFound = lazy(() => import('./pages/Home/PageNotFound'));
const RegisterForm = lazy(() => import('./component/auth/RegisterForm'));
const LoginForm = lazy(() => import('./component/auth/LoginForm'));
const Auth = lazy(() => import('./pages/Auth/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Layout = lazy(() => import('./pages/Home/Layout'));
const AddQuiz = lazy(() => import('./pages/Quiz/AddQuiz'));
const QuizLink = lazy(() => import('./pages/Quiz/QuizLink'));
const QuizResponse = lazy(() => import('./pages/Quiz/QuizResponse'));
const QuizResult = lazy(() => import('./pages/Quiz/QuizResult'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const QuestionAnalysis = lazy(() => import('./pages/Analytics/QuestionAnalysis'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </Router>
    </>
  );
}

export default App;
