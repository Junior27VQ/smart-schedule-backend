import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CoursesManager from './pages/CoursesManager'
import ScheduleConfig from './pages/ScheduleConfig'
import ScheduleResult from './pages/ScheduleResult'
import ScheduleDetail from './pages/ScheduleDetail'

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="app-container">
        {/* Barra de Navegación Global provisional */}
        <nav style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 'bold' }}>Generador</Link>
          <Link to="/config" style={{ textDecoration: 'none', color: '#6ab91f', fontWeight: 'bold' }}>Configuracion</Link>
          
        </nav>

        {/* Enrutador de Páginas */}
        <Routes>
          <Route path="/" element={<CoursesManager/>} />
          <Route path='/config' element={<ScheduleConfig/>} />
          <Route path='/schedule-result' element={<ScheduleResult/>} />
          <Route path='schedule-detail' element={<ScheduleDetail/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
