import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import TeacherApp from './components/TeacherApp.jsx';
import { TransitionProvider } from './context/TransitionContext.jsx';

function App() {
  return (
    <Router>
      <TransitionProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<TeacherApp />} />
        </Routes>
      </TransitionProvider>
    </Router>
  )
}

export default App